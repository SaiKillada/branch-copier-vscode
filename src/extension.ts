import * as vscode from 'vscode';

interface GitRepository {
  rootUri: vscode.Uri;
  state: {
    HEAD: { name?: string } | undefined;
    onDidChange: vscode.Event<void>;
  };
}

interface GitAPI {
  repositories: GitRepository[];
  onDidOpenRepository: vscode.Event<GitRepository>;
}

const COPY_COMMAND_ID = 'branchCopier.copyBranchName';

export function activate(context: vscode.ExtensionContext): void {
  const copyItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
  copyItem.text = '$(copy)';
  copyItem.command = COPY_COMMAND_ID;
  context.subscriptions.push(copyItem);

  let currentBranch: string | undefined;

  const render = () => {
    if (currentBranch) {
      copyItem.tooltip = `Copy branch name "${currentBranch}" to clipboard`;
      copyItem.show();
    } else {
      copyItem.hide();
    }
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(COPY_COMMAND_ID, async () => {
      if (!currentBranch) {
        return;
      }
      await vscode.env.clipboard.writeText(currentBranch);
      vscode.window.setStatusBarMessage(`Copied branch "${currentBranch}" to clipboard`, 2000);
    })
  );

  const trackRepository = (repo: GitRepository) => {
    const update = () => {
      currentBranch = repo.state.HEAD?.name;
      render();
    };
    update();
    context.subscriptions.push(repo.state.onDidChange(update));
  };

  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    return;
  }

  gitExtension.activate().then((exports: { getAPI(version: 1): GitAPI }) => {
    const git = exports.getAPI(1);
    git.repositories.forEach(trackRepository);
    context.subscriptions.push(git.onDidOpenRepository(trackRepository));
  });
}

export function deactivate(): void {}

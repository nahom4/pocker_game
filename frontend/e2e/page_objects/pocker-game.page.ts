import { Page } from '@playwright/test';

export class PokerGamePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://127.0.0.1:3000/');
  }

  async startNewHand() {
    await this.page.getByTestId('poker.start-game-button').click();
  }

  async applyStack(value: number) {
    await this.page.getByTestId('poker.stack-input').fill(value.toString());
    await this.page.getByTestId('poker.apply-button').click();
  }

  async logAction(action: string, amount: number) {
    await this.page.getByTestId('poker.action-input').fill(`${action} ${amount}`);
    await this.page.getByTestId('poker.log-action-button').click();
  }

  async navigateToHistoryPage() {
    await this.page.getByTestId('poker.history-page-link').click();
  }

  getElements() {
    return {
      handHistoryTitle: this.page.getByTestId('hand-history-title'),
      handId0: this.page.getByTestId('hand-id-0'),
      startButton: this.page.getByTestId('poker.start-button'),
      foldButton: this.page.getByTestId('fold-button'),
      callButton: this.page.getByTestId('call-button'),
      raiseButton: this.page.getByTestId('raise-button'),
      allInButton: this.page.getByTestId('allin-button'),
      applyButton: this.page.getByTestId('poker.apply-button'),
      stackInput: this.page.getByTestId('poker.stack-input'),
      handLog: this.page.getByTestId('hand-log'),
      actionControls:  this.page.getByTestId('action-controls'),
      gameTitle: this.page.getByTestId('poker.game-title'),
      stacksHeading: this.page.getByRole('heading', { name: 'Stacks' }),
      playerActionsHeading: this.page.getByRole('heading', { name: 'Player Actions' }),
      confirmationMessage: this.page.getByTestId('poker.confirmation-message'),
      handInfo: this.page.getByTestId('hand-info'),
      blindInfo: this.page.getByTestId('blind-info'),
      handLogButton: this.page.getByTestId('hand-log'),
      handHistory : this.page.getByTestId('hand-history')
    };
  }
}
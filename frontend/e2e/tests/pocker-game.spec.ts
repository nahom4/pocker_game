import { test, expect } from '../fixtures/pocker-fixture';

test.describe('Poker Game Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/poker-game');
  });

  test('UI elements must appear', async ({page, pokerGamePage }) => {
   ;
    const applyButton = pokerGamePage.getElements().applyButton;
    const startGameButton = pokerGamePage.getElements().startButton;
    const stackInput = pokerGamePage.getElements().stackInput;
    const gameTitle = pokerGamePage.getElements().gameTitle;
    const stacksHeading = pokerGamePage.getElements().stacksHeading;
    const playerActionsHeading = pokerGamePage.getElements().playerActionsHeading;
    
    await expect(applyButton).toBeVisible();
    await expect(startGameButton).toBeVisible();
    await expect(stackInput).toBeVisible();
    await expect(gameTitle).toBeVisible();
    await expect(stacksHeading).toBeVisible();
    await expect(playerActionsHeading).toBeVisible();

  });

  test('Stack needs to be able to be updated', async ({ page,pokerGamePage }) => {
    const stackInput = pokerGamePage.getElements().stackInput;
    const applyButton = pokerGamePage.getElements().applyButton;
    const confirmationMessage = pokerGamePage.getElements().confirmationMessage;
    await stackInput.fill('100000');
    await applyButton.click();
    await expect(confirmationMessage).toContainText('Stack updated to 100000');
  });

  test('Game needs to be started', async ({ page,pokerGamePage }) => {
    const startGameButton = pokerGamePage.getElements().startButton;
    const handInfo = pokerGamePage.getElements().handInfo;
    const blindInfo = pokerGamePage.getElements().blindInfo;
    const foldButton = pokerGamePage.getElements().foldButton;
    const callButton = pokerGamePage.getElements().callButton;
    const raiseButton = pokerGamePage.getElements().raiseButton;
    const allInButton = pokerGamePage.getElements().allInButton;

    await startGameButton.click();
    await expect(handInfo).toBeVisible();
    await expect(blindInfo).toBeVisible();
    await expect(foldButton).toBeVisible();
    await expect(callButton).toBeVisible();
    await expect(raiseButton).toBeVisible();
    await expect(allInButton).toBeVisible();

  });

  test('Interact with the buttons and the expected action logs should appear', async ({ page,pokerGamePage }) => {
 
    const elements = pokerGamePage.getElements();
    await elements.startButton.click();
    await elements.foldButton.click();
    await expect(elements.handLog).toContainText('Player 3 fold');
    await elements.callButton.click();
    await expect(elements.handLog).toContainText('Player 4 call');
    await elements.raiseButton.click();
    await expect(elements.handLog).toContainText('Player 5 raise to 80 chips');
    // await elements.allInButton.click();
    // await expect(elements.handLog).toContainText('Player went all-in');
   
  });

  test('Round changes, cards dealt, and game ends should be communicated', async ({ page }) => {
    const startGameButton = page.getByTestId('poker.start-game-button');
    const logActionButton = page.getByTestId('poker.log-action-button');
    const actionInput = page.getByTestId('poker.action-input');
    const handLog = page.getByTestId('poker.hand-log');

    await startGameButton.click();
    await actionInput.fill('deal');
    await logActionButton.click();
    await expect(handLog).toContainText('Cards dealt');
    await actionInput.fill('end');
    await logActionButton.click();
    await expect(handLog).toContainText('Game ended');
  });

  test('The game played should appear on the history page', async ({ page, pokerGamePage }) => {
    const elements = pokerGamePage.getElements();
    await elements.startButton.click();
    var hand_uuid = await page.getByTestId('hand-uuid').textContent(); 
    await page.waitForTimeout(500);  
    if (hand_uuid) {
      while (await elements.actionControls.isVisible()) {
        const actionButtons = await elements.actionControls.locator('button').all();
        const randomIndex = Math.floor(Math.random() * actionButtons.length);  
        await actionButtons[randomIndex].click();  
    
        await page.waitForTimeout(500);  
      }
    
      const handHistoryText = await elements.handHistory.textContent();  // Get the full text from handHistory
      expect(handHistoryText).toContain(hand_uuid);
    } else {
      throw new Error('hand-uuid is null');
    }
  });
  
});
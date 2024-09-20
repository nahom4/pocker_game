import { test, expect } from '../fixtures/pocker-fixture';

test.describe('Poker Game Tests', () => {
  test.beforeEach(async ({ page,pokerGamePage }) => {
    await pokerGamePage.goto();
  });

  test('UI elements must appear', async ({pokerGamePage }) => {
   
    const applyButton = pokerGamePage.getElements().applyButton;
    const startGameButton = pokerGamePage.getElements().startButton;
    const stackInput = pokerGamePage.getElements().stackInput;
    const gameTitle = pokerGamePage.getElements().gameTitle;
    const stacksHeading = pokerGamePage.getElements().stacksHeading;
    
    await expect(applyButton).toBeVisible();
    await expect(startGameButton).toBeVisible();
    await expect(stackInput).toBeVisible();
    await expect(gameTitle).toBeVisible();
    await expect(stacksHeading).toBeVisible();

  });

  test('Stack needs to be able to be updated', async ({page,pokerGamePage }) => {
    const stackInput = pokerGamePage.getElements().stackInput;
    const applyButton = pokerGamePage.getElements().applyButton;
    const confirmationMessage = pokerGamePage.getElements().confirmationMessage;

    await stackInput.fill('100000');
    await applyButton.click();
    await expect(confirmationMessage).toContainText('Stack updated to 100000');
  });

  test('Game needs to be started', async ({pokerGamePage }) => {
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

  test('Interact with the buttons and the expected action logs should appear', async ({pokerGamePage }) => {
 
    const elements = pokerGamePage.getElements();
    await elements.startButton.click();
    await elements.foldButton.click();
    await expect(elements.handLog).toContainText('Player 3: fold');
    await elements.callButton.click();
    await expect(elements.handLog).toContainText('Player 4: call');
    await elements.raiseButton.click();
    await expect(elements.handLog).toContainText('Player 5: raise to 80 chips');
    await elements.allInButton.click();
    await expect(elements.handLog).toContainText('Player 0: allin');
   
  });


  test('The game played should appear on the history page', async ({ page, pokerGamePage }) => {
    const elements = pokerGamePage.getElements();
    await elements.startButton.click();
    var hand_uuid = await page.getByTestId('hand-uuid').textContent(); 
    await page.waitForTimeout(500);  
    if (hand_uuid) {
      while (await elements.actionControls.isVisible()) {
        const actionButtons = await elements.actionControls.locator('button').all();
        await actionButtons[0].click();  
    
        await page.waitForTimeout(500);  
      }
    
      await page.waitForTimeout(3000);
      const handHistoryText = await elements.handHistory.textContent();  // Get the full text from handHistory
      const regex = new RegExp(`${hand_uuid.trim()}`);
      expect(handHistoryText).toMatch(regex);
    } else {
      throw new Error('hand-uuid is null');
    }
  });
  
});
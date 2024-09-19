import { test as base } from '@playwright/test';
import { PokerGamePage } from '../page_objects/pocker-game.page'

// Declare the types of your fixtures.
type PokerFixture = {
  pokerGamePage: PokerGamePage;
};

// Extend base test by providing "pokerGamePage"
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<PokerFixture>({
  pokerGamePage: async ({ page }, use) => {
    // Set up the fixture.
    const pokerGamePage = new PokerGamePage(page);

    await pokerGamePage.goto();

    // Use the fixture value in the test.
    await use(pokerGamePage);

    // Clean up the fixture.
  },
  // other pages or fixtures can be added here
});

export { expect } from '@playwright/test';
import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
    readonly page: Page;
    private static readonly homePage_PATH = "/web/index.php/dashboard/index";
    private readonly loggedInAs: Locator
    private readonly heading: Locator

    constructor(page: Page) {
        this.page = page;
        this.loggedInAs = page.locator('.oxd-userdropdown-name');
        this.heading = page.getByRole('heading', { name: 'Dashboard' });
    }

    async waitForLoaded() {
        // Don't navigate: this page is reached by logging in, so just confirm we've arrived.
        await expect(this.page).toHaveURL(new RegExp(`${DashboardPage.homePage_PATH}$`));
        await expect(this.heading).toBeVisible();
    }

    async getLoggedInUsersName(): Promise<string> {
        await expect(this.loggedInAs).not.toBeEmpty();
        return (await this.loggedInAs.innerText()).trim();
    }
}
import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    // Public so tests can assert they disappear with toBeHidden(), which retries until the message is gone.
    readonly errorAlert: Locator;
    readonly passwordEmptyError: Locator;
    readonly usernameEmptyError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.errorAlert = page.getByRole('alert');
        this.usernameEmptyError = page.locator('.oxd-input-group')
            .filter({ has: this.usernameInput })
            .locator('.oxd-input-field-error-message');
        this.passwordEmptyError = page.locator('.oxd-input-group')
            .filter({ has: this.passwordInput })
            .locator('.oxd-input-field-error-message');
    }

    async openPage() {
        await this.page.goto('/web/index.php/auth/login');
        await expect(this.loginButton).toBeVisible();
    }

    async pageLoaded() {
        await expect(this.page).toHaveURL(/auth\/login$/);
    }

    async enterUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async selectLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    async attemptLogin(username: string, password: string): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.selectLoginButton();
    }

    async getErrorMessage(): Promise<string> {
        await expect(this.errorAlert).toBeVisible();
        return (await this.errorAlert.innerText()).trim();
    }

    async getUsernameEmptyErrorMessage(): Promise<string> {
        await expect(this.usernameEmptyError).toBeVisible();
        return (await this.usernameEmptyError.innerText()).trim();
    }

    async getPasswordEmptyErrorMessage(): Promise<string> {
        await expect(this.passwordEmptyError).toBeVisible();
        return (await this.passwordEmptyError.innerText()).trim();
    }

    async getPasswordInputType(): Promise<string> {
        // type="password" is what makes the browser mask the characters typed into the field.
        return (await this.passwordInput.getAttribute('type')) ?? '';
    }

    async getUsernameValue(): Promise<string> {
        return await this.usernameInput.inputValue();
    }

    async getPasswordValue(): Promise<string> {
        return await this.passwordInput.inputValue();
    }
}
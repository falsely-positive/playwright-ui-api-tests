import { test, expect } from '../fixtures/test';
import { env } from "../environments";


const invalidUser: string = "Invalid credentials";
const ADMIN_USER = env.users.username;
const ADMIN_PASSWORD = env.users.password;

test.describe('Login', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.openPage();
  });

  test.describe('Successful login', () => {
    test('a user with valid credentials is signed in to the dashboard', async ({ loginPage, dashboardPage}) => {
      await loginPage.attemptLogin(ADMIN_USER, ADMIN_PASSWORD);
      await dashboardPage.waitForLoaded();
      // The demo site's employee name can be edited by anyone, so only check that a name is shown.
      // On a site with stable data you could assert the exact value instead
      const loggedInUser = await dashboardPage.getLoggedInUsersName();
      expect(loggedInUser).not.toBe('');
    })
  });

  test.describe('Invalid credentials', () => {
    test('wrong username shows "Invalid credentials" and stays on the login page', async ({ loginPage, page }) => {
      await loginPage.attemptLogin('wrongName', ADMIN_PASSWORD);
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(invalidUser);
      await expect(page).toHaveURL(/auth\/login$/);
    })

    test('wrong password shows "Invalid credentials" and stays on the login page', async ({ loginPage }) => {
      await loginPage.attemptLogin(ADMIN_USER, 'wrongPassword');
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(invalidUser);
      await loginPage.pageLoaded()
    })

    test('the username and password fields are cleared after a failed login', async ({ loginPage }) => {
      await loginPage.attemptLogin(ADMIN_USER, 'wrongPassword');
      // Wait for the failed login to complete; the page reloads with empty fields before the alert is shown.
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(invalidUser);

      const usernameValue = await loginPage.getUsernameValue();
      expect(usernameValue).toBe('');
      const passwordValue = await loginPage.getPasswordValue();
      expect(passwordValue).toBe('');
    })
  })

  test.describe('Required field validation', () => {

    test('missing password shows "Required" under the password field', async ({ loginPage}) => {
      await loginPage.enterUsername(ADMIN_USER);
      await loginPage.selectLoginButton();
      const passwordErrorMessage = await loginPage.getPasswordEmptyErrorMessage();
      expect(passwordErrorMessage).toBe('Required');
    })

    test('missing username shows "Required" under the username field', async ({ loginPage }) => {
      await loginPage.enterPassword('pass');
      await loginPage.selectLoginButton();
      const usernameErrorMessage = await loginPage.getUsernameEmptyErrorMessage();
      expect(usernameErrorMessage).toBe('Required');
    })

    test('missing username and password shows "Required" under both fields', async ({ loginPage}) => {
      await loginPage.selectLoginButton();
      const passwordErrorMessage = await loginPage.getPasswordEmptyErrorMessage();
      expect(passwordErrorMessage).toBe('Required');
      const usernameErrorMessage = await loginPage.getUsernameEmptyErrorMessage();
      expect(usernameErrorMessage).toBe('Required');
    })

    test('each "Required" message clears only when its own field is filled in', async ({ loginPage }) => {
      await loginPage.selectLoginButton();
      // Confirm both messages appeared first, otherwise the hidden checks below would pass trivially.
      const usernameErrorMessage = await loginPage.getUsernameEmptyErrorMessage();
      expect(usernameErrorMessage).toBe('Required');
      const passwordErrorMessage = await loginPage.getPasswordEmptyErrorMessage();
      expect(passwordErrorMessage).toBe('Required');

      await loginPage.enterUsername(ADMIN_USER);
      await expect(loginPage.usernameEmptyError).toBeHidden();
      // Typing a username mustn't clear the password's message.
      await expect(loginPage.passwordEmptyError).toBeVisible();

      await loginPage.enterPassword(ADMIN_PASSWORD);
      await expect(loginPage.passwordEmptyError).toBeHidden();
    })

    test.fail('the "Invalid credentials" alert clears when the next attempt fails field validation', async ({ loginPage }) => {
      await loginPage.attemptLogin(ADMIN_USER, 'WrongPassword');
      expect(await loginPage.getErrorMessage()).toBe(invalidUser);
      await loginPage.enterUsername(ADMIN_USER);
      await loginPage.selectLoginButton();
      const passwordErrorMessage = await loginPage.getPasswordEmptyErrorMessage();
      expect(passwordErrorMessage).toBe("Required");
      await expect(loginPage.errorAlert).toBeHidden();
    })
  })

  test.describe('Password field', () => {

    test('the password is masked as it is typed', async ({ loginPage }) => {
      await loginPage.enterPassword(ADMIN_PASSWORD);
      const passwordInputType = await loginPage.getPasswordInputType();
      expect(passwordInputType).toBe('password');
    })
  })
});

import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from "../pages/dashboardPage"
import { PetsApi } from "../api/petsAPI"

type MyFixtures = {
    loginPage: LoginPage
    dashboardPage: DashboardPage
    petsApi: PetsApi
}

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },
    petsApi: async({ request }, use ) => {
        const petsAPI = new PetsApi( request )
        await use(petsAPI);
    }
})

export { expect };

import { expect } from '@playwright/test';
import { test, TestFixtures, TestOptions } from '../fixtures/fixture1';

 

test.describe('Login Tests, with valid credentials', () => {
    
    test.use({ role: 'demoUser', checkIf: 'homeUrl' });
    test('Should login successfully with valid credentials', async ({ loginPage, homePageCheck }) => {
        console.log('+++++ Test1 +++++');
    });

     test('Checking that the use keeps the vals', async ({ loginPage, homePageCheck }) => {
        console.log('+++++ Test2 +++++');
    });

});

test.describe('Login Tests, with invalid credentials', () => {
   
    test.use({ role: 'wrongUser', checkIf: 'errorBarVisible' });
    test('Should show error for invalid creds', async ({ loginPage, homePageCheck }) => {
    });

});

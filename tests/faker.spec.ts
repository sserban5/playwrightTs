import { test, expect } from '@playwright/test';
import { generatePeople } from '../data/faker';


test.describe('Faker checks', () => {

  test('Faker for people generation', async ({ page }) => {
    for (let index = 0; index < 5; index++) {
      const userData = generatePeople();
      console.log(`Test File ${index}- Registered User:`, userData);
    }
  });

});
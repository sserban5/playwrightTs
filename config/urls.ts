export const URLs ={
    base:       'https://training.testifi.io',
    loginPage:  '/login',
    testPage:   '/test',
    petsPage:   '/pets',
    homePage:   '/home'

}


export function getUrl(path: string): string {
  return `${URLs.base}${path}`;
}
 
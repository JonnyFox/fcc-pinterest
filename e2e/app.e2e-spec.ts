import { FccPinterestPage } from './app.po';

describe('fcc-pinterest App', () => {
  let page: FccPinterestPage;

  beforeEach(() => {
    page = new FccPinterestPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

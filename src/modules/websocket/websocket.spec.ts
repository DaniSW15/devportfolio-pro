import { Websocket } from './websocket';

describe('Websocket', () => {
  it('should be defined', () => {
    expect(new Websocket()).toBeDefined();
  });
});

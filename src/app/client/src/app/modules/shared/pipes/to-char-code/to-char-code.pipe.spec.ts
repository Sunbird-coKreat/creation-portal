import { ToCharCodePipe } from './to-char-code.pipe';

describe('FilterPipe', () => {
  describe('#transform', () => {
    it('Should take input and return proper data', () => {
      const pipe = new ToCharCodePipe();
      const result = pipe.transform(65);
      expect(result).toBe('A');
    });
  });
});

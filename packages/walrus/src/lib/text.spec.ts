import * as text from './text';

describe('text', () => {
  describe('addBefore', () => {
    describe('new prefix', () => {
      it('should add new content in front', () => {
        expect(text.addBefore('finders keepers', 'losers weepers')).toEqual('losers weepersfinders keepers');
      });
    });
    describe('same prefix', () => {
      it('should recognize existing prefix', () => {
        expect(text.addBefore('abcde', 'abc')).toEqual('abcde');
      });
    });
  });
  describe('addAfter', () => {
    describe('new suffix', () => {
      it('should add new content at end', () => {
        expect(text.addAfter('finders keepers', 'losers weepers')).toEqual('finders keeperslosers weepers');
      });
    });
    describe('same suffix', () => {
      it('should recognize existing suffix', () => {
        expect(text.addAfter('abcde', 'cde')).toEqual('abcde');
      });
    })
  });
  describe('ucFirst', () => {
    it('should capitalize first letter', () => {
      expect(text.capFirst('phrase')).toEqual('Phrase');
    });
    it('should capitalize letter afternon-letter content', () => {
      expect(text.capFirst('101 dalmatians')).toEqual('101 Dalmatians');
    });
  });
});

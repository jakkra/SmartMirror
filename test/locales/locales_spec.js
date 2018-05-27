const enUS = require('../../locales/en-US');
const svSE = require('../../locales/sv-SE');
const expect = require('chai').expect;

function findDuplicates(list, duplicates = []) {
  if (!list.length) return duplicates;
  const [word, ...predicate] = list;
  if (predicate.map(w => w.toLowerCase()).includes(word.toLowerCase())) {
    duplicates = [...duplicates, word];
  }
  return findDuplicates([...predicate], duplicates);
}

describe('locale', () => {
  describe('findDuplicates', () => {
    it('returns duplicate words', () => {
      const mock = ['one', 'two', 'three', 'two', 'four', 'three'];
      expect(findDuplicates(mock)).to.include('two');
      expect(findDuplicates(mock)).to.include('three');
    });
    it('returns empty array when no duplicate words', () => {
      const mock = ['one', 'two', 'three', 'four'];
      expect(findDuplicates(mock)).to.be.an('array').that.is.empty;
    });
  });
  describe('en-US', () => {
    it('has no duplicate keys', () => {
      const keywords = Object.keys(enUS.speech).reduce((list, category) => {
        return [...list, ...enUS.speech[category]];
      }, []);
      expect(findDuplicates(keywords)).to.be.an('array').that.is.empty;
    });
  });
  describe('sv-SE', () => {
    it('has no duplicate keys', () => {
      const keywords = Object.keys(svSE.speech).reduce((list, category) => {
        return [...list, ...svSE.speech[category]];
      }, []);
      expect(findDuplicates(keywords)).to.be.an('array').that.is.empty;
    });
  });
});

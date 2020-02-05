import { expect } from 'chai';
import { Piece } from '../../src/server/Piece';

it('randomPiece', () => {
  expect(Piece.randomPiece()).to.have.keys(['num', 'rot']);
  expect(Piece.randomPiece()).to.not.have.keys(['x', 'y']);
})

it('genFlow', () => {
  expect(Piece.genFlow(10)).to.have.length(10);
})

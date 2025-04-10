import { type VirtualPositionItem, type ViewportStateItems } from '../src';
import { getFirstItem, getItems, getLastItem, recombineByOffset } from '../src/store/vp/viewport.helpers';

type ItemsToUpdate = Pick<ViewportStateItems, 'items' | 'start' | 'end'>;

describe('revo-grid-viewport', () => {
  const virtualSize = 600;
  const originItemSize = 30;
  const rows = 100;

  const realSize = rows * originItemSize;
  let recombined: ItemsToUpdate = {
    items: [],
    start: 0,
    end: 0,
  };
  let range = { start: 0, end: 0 };
  let items: VirtualPositionItem[] = getItems({
    firstItemStart: 0,
    firstItemIndex: 0,
    origSize: originItemSize,
    maxSize: virtualSize,
    maxCount: rows,
  });
  range.end = items.length - 1;

  it('Items are ready for recombination', () => expect(items).toBeDefined());

  // repeat recombination several time same way as user scroll
  for (let i = 0; i < 120; i++) {
    describe(`Recombination ${i}`, () => {
      const newRecombined = recombineByOffset(i % 5, {
        positiveDirection: i < 100,
        start: range.start,
        end: range.end,
        items,
        originItemSize,
        realSize,
        sizes: {},
      });
      if (!newRecombined) {
        return;
      } else {
        recombined = newRecombined;
      }

      it('Recombination exist', () => {
        expect(recombined?.items?.length).toBeGreaterThan(0);
      });

      it('Start should be positive', () => {
        let i = 0;
        while (i < recombined.items.length) {
          const item = recombined.items[i % recombined.items.length];
          expect(item.start).toBeGreaterThanOrEqual(0);
          i++;
        }
      });

      it('End should be in range', () => {
        let i = 0;
        while (i < recombined.items.length) {
          const item = recombined.items[i % recombined.items.length];
          expect(item.end).toBeLessThanOrEqual(realSize);
          i++;
        }
      });

      it('Indexes should be positive', () => {
        let i = 0;
        while (i < recombined.items.length) {
          const item = recombined.items[i % recombined.items.length];
          expect(item.itemIndex).toBeGreaterThanOrEqual(0);
          i++;
        }
      });

      it('First item should not be less than last', () => {
        const first = getFirstItem(recombined);
        const last = getLastItem(recombined);
        expect(last.itemIndex).toBeGreaterThan(first.itemIndex);
      });

      it('Range should be in order: 1, 2, 3...', () => {
        let prev: VirtualPositionItem | null = null;
        let i = recombined.start;
        let count = 0;
        while (count < recombined.items.length) {
          const item = recombined.items[i % recombined.items.length];
          if (prev) {
            expect(Math.abs(item.itemIndex - prev.itemIndex)).toEqual(1);
          }
          prev = item;
          count++;
          i++;
        }
      });

      items = recombined.items;
      range.start = recombined.start;
      range.end = recombined.end;
    });
  }
  console.log(recombined);
});

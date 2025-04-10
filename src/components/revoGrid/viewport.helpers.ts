/**
 * Collects data for pinned columns in the required @ViewportProps format.
 */

import { DimensionRows, MultiDimensionType, SlotType, Cell, ViewportColumn } from '@type';

/**
 * Represents the slot names for the viewport slots.
 */
export const HEADER_SLOT = 'header'; // Slot name for the header slot
export const FOOTER_SLOT = 'footer'; // Slot name for the footer slot
export const CONTENT_SLOT = 'content'; // Slot name for the content slot
export const DATA_SLOT = 'data'; // Slot name for the data slot

/**
 * Returns the last visible cell in the viewport for a given row type.
 * Coordinates are not zero-based and are relative to the viewport.
 * If needed to be zero-based they can be adjusted by subtracting 1.
 */
export function getLastCell(
  data: ViewportColumn,
  rowType: MultiDimensionType,
): Cell {
  // Get the last visible column count from the viewport column data.
  const lastVisibleColumnCount = data.viewports[data.colType].store.get('realCount');

  // Get the last visible row count for the given row type from the viewport column data.
  const lastVisibleRowCount = data.viewports[rowType].store.get('realCount');

  // Return the last visible cell with the last visible column count and row count.
  return {
    x: lastVisibleColumnCount,
    y: lastVisibleRowCount,
  };
}


export function viewportDataPartition(
  data: ViewportColumn,
  type: DimensionRows,
  slot: SlotType,
  fixed?: boolean,
) {
  return {
    colData: data.colStore,
    viewportCol: data.viewports[data.colType].store,
    viewportRow: data.viewports[type].store,
    // lastCell is the last real coordinate + 1
    lastCell: getLastCell(data, type),
    slot,
    type,
    canDrag: !fixed,
    position: data.position,
    dataStore: data.rowStores[type].store,
    dimensionCol: data.dimensions[data.colType].store,
    dimensionRow: data.dimensions[type].store,
    style: fixed
      ? { height: `${data.dimensions[type].store.get('realSize')}px` }
      : undefined,
  };
}

export type VPPartition = ReturnType<typeof viewportDataPartition>;
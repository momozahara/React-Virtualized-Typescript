import React, { FC, useEffect, useRef, useState } from "react";

import {
  List as _List,
  ListProps,
  ListRowProps,
  CellMeasurer as _CellMeasurer,
  CellMeasurerProps,
  CellMeasurerCache,
  WindowScroller as _WindowScroller,
  WindowScrollerProps,
  WindowScrollerChildProps,
} from "react-virtualized";

import { faker } from "@faker-js/faker";

const List = _List as unknown as FC<ListProps>;

const WindowScroller = _WindowScroller as unknown as FC<WindowScrollerProps>;

const CellMeasurer = _CellMeasurer as unknown as FC<CellMeasurerProps>;

const tList = new Array(200)
  .fill(true)
  .map(() => [`Hello: ${faker.name.fullName()}`, faker.lorem.paragraphs()]);

export default function Virtualize() {
  const [list, setList] = useState<string[][]>([]);
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 1000,
    })
  );

  useEffect(() => {
    window.addEventListener("resize", function () {
      cache.current.clearAll();
    });
  }, []);

  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      setList((oldArray) => [...oldArray, tList[i]]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lg:w-[800px] mx-4 lg:mx-auto">
      <WindowScroller>
        {({
          height,
          width,
          isScrolling,
          registerChild,
          scrollTop,
        }: WindowScrollerChildProps) => {
          return (
            <div
              ref={registerChild as unknown as React.RefObject<HTMLDivElement>}
            >
              <div className="mx-8 my-[40px]">Buffer</div>
              <List
                autoHeight
                autoWidth
                height={height}
                width={width}
                rowHeight={cache.current.rowHeight}
                rowCount={list.length}
                deferredMeasurementCache={cache.current}
                isScrolling={isScrolling}
                scrollTop={scrollTop}
                onRowsRendered={({ stopIndex }) => {
                  console.log(stopIndex, list.length);
                  if (stopIndex + 1 === list.length) {
                    for (let i = stopIndex; i < stopIndex + 5; i++) {
                      setList((oldArray) => [...oldArray, tList[i]]);
                    }
                  }
                }}
                rowRenderer={function ({
                  key,
                  index,
                  parent,
                  style,
                }: ListRowProps): React.ReactNode {
                  return (
                    <CellMeasurer
                      key={key}
                      cache={cache.current}
                      parent={parent}
                      columnIndex={0}
                      rowIndex={index}
                    >
                      <div
                        style={style}
                        className="py-4"
                      >
                        <div className="bg-zinc-800 text-white px-8 py-4 rounded-lg">
                          <div className="text-xl">{list[index][0]}</div>
                          <div className="border-b border-solid border-zinc-500 my-4 mx-[-2rem]" />
                          <div className="text-base">{list[index][1]}</div>
                        </div>
                      </div>
                    </CellMeasurer>
                  );
                }}
              />
            </div>
          );
        }}
      </WindowScroller>
    </div>
  );
}

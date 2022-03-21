import { useTable, usePagination } from "react-table";
import React from "react";

import { useEffect } from "react";

function Table(props) {
  const data = props.tableContentArray;

  const columns = props.tableHeader;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,

    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex },
  } = useTable({ columns, data }, usePagination);

  useEffect(() => {
    setPageSize(5);
  }, [setPageSize]);

  return (
    <div className={props.classes.full__table}>
      <div className={props.classes.header}>{props.header}</div>

      <table {...getTableProps()} className={props.classes.table}>
        <thead className={props.classes.tablehead}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className={props.classes.table__body} {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pageCount > 1 && (
        <div className={props.classes.actions}>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span className={props.classes.pagination__span}>
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
        </div>
      )}
    </div>
  );
}

export default Table;

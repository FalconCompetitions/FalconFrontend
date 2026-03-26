"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useSubmissions from "./hooks/useSubmissions";
import { TableSkeleton } from "@/components/_ui/Skeleton/TableSkeleton";

const AdminTeamPage: React.FC = () => {
    const [currentTable, setCurrentTable] = useState<"correct" | "wrong">(
        "correct"
    );

    const { rows, displayedColumns, title, isLoading } = useSubmissions(currentTable);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        setPage(0);
    }, [rows]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleTableChange = (table: "correct" | "wrong") => {
        setCurrentTable(table);
    };

    return (
        <>
            <Typography
                variant="h5"
                component="div"
                sx={{
                    mb: 3,
                    textAlign: "center",
                    color: "#4F85A6",
                    fontWeight: 700,
                    fontSize: "1.75rem",
                    letterSpacing: "-0.5px",
                }}
            >
                {title}
            </Typography>

            <div
                style={{
                    marginBottom: "-2px",
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    gap: "8px",
                    borderBottom: "2px solid rgba(79, 133, 166, 0.2)",
                    paddingBottom: "0",
                }}
            >
                <Button
                    variant={currentTable === "correct" ? "contained" : "text"}
                    onClick={() => handleTableChange("correct")}
                    sx={{
                        bgcolor:
                            currentTable === "correct"
                                ? "#4F85A6"
                                : "transparent",
                        color: currentTable === "correct" ? "#fff" : "#4F85A6",
                        fontWeight: 600,
                        borderRadius: "8px 8px 0 0",
                        px: 3,
                        py: 1.2,
                        transition: "all 0.2s ease",
                        fontSize: "14px",
                        textTransform: "none",
                        boxShadow: "none",
                        border: currentTable === "correct" ? "none" : "1px solid rgba(79, 133, 166, 0.2)",
                        "&:hover": {
                            bgcolor:
                                currentTable === "correct"
                                    ? "#3d6a87"
                                    : "rgba(79, 133, 166, 0.08)",
                            boxShadow: "none",
                        },
                    }}
                >
                    Exercícios Corretos
                </Button>
                <Button
                    variant={currentTable === "wrong" ? "contained" : "text"}
                    onClick={() => handleTableChange("wrong")}
                    sx={{
                        bgcolor:
                            currentTable === "wrong"
                                ? "#4F85A6"
                                : "transparent",
                        color: currentTable === "wrong" ? "#fff" : "#4F85A6",
                        fontWeight: 600,
                        borderRadius: "8px 8px 0 0",
                        px: 3,
                        py: 1.2,
                        transition: "all 0.2s ease",
                        fontSize: "14px",
                        textTransform: "none",
                        boxShadow: "none",
                        border: currentTable === "wrong" ? "none" : "1px solid rgba(79, 133, 166, 0.2)",
                        "&:hover": {
                            bgcolor:
                                currentTable === "wrong"
                                    ? "#3d6a87"
                                    : "rgba(79, 133, 166, 0.08)",
                            boxShadow: "none",
                        },
                    }}
                >
                    Exercícios Errados
                </Button>
            </div>

            {isLoading ? (
                <TableSkeleton columns={displayedColumns.length} rows={5} />
            ) : (
            <Paper
                sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}
            >
                <TableContainer
                    sx={{
                        maxHeight: "calc(100vh - 250px)",
                        "&::-webkit-scrollbar": {
                            width: "10px",
                            height: "10px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "#f1f5f9",
                            borderRadius: "10px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#4F85A6",
                            borderRadius: "10px",
                            "&:hover": {
                                background: "#3d6a87",
                            },
                        },
                    }}
                >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {displayedColumns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{
                                            minWidth: column.minWidth,
                                        }}
                                        sx={{
                                            backgroundColor: "#4F85A6",
                                            color: "#fff",
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            letterSpacing: "0.3px",
                                            py: 2.5,
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 100,
                                            borderBottom: "2px solid rgba(255, 255, 255, 0.15)",
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={index}
                                        sx={{
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                backgroundColor: "rgba(79, 133, 166, 0.08)",
                                                cursor: "pointer",
                                            },
                                            "&:last-child td": {
                                                borderBottom: "none",
                                            },
                                        }}
                                    >
                                        {displayedColumns.map((column) => {
                                            const value =
                                                row[
                                                    column.id as keyof typeof row
                                                ];
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    sx={{
                                                        fontSize: "15px",
                                                        fontWeight: 500,
                                                        py: 2.5,
                                                        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                                                    }}
                                                >
                                                    {column.format &&
                                                    typeof value === "number"
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Valores por página:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} de ${
                            count !== -1 ? count : `mais de ${to}`
                        }`
                    }
                    sx={{
                        borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                            fontSize: "14px",
                            fontWeight: 500,
                        },
                        "& .MuiIconButton-root": {
                            color: "#4F85A6",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                backgroundColor: "rgba(79, 133, 166, 0.1)",
                            },
                            "&.Mui-disabled": {
                                color: "rgba(79, 133, 166, 0.3)",
                            },
                        },
                    }}
                />
            </Paper>
            )}
        </>
    );
};

export default AdminTeamPage;

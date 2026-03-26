"use client"

import React from "react";
import { StyledTable } from "./styles";
import { TableProps } from "./types";
import { TableBody, TableCell, TableRow } from "@mui/material";
import Loading from "../Loading";
import EmptyState from "../EmptyState";

import type { ForwardedRef } from "react";

const Table = React.forwardRef<HTMLTableElement, TableProps>(
    ({ children, loading, empty, emptyMessage, emptyDescription, colSpan = 5 }, ref: ForwardedRef<HTMLTableElement>) => {
        if (loading) {
            return (
                <StyledTable ref={ref}>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={colSpan} align="center" sx={{ py: 8 }}>
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Loading size="md" variant="spinner" />
                                    <span className="text-gray-500 text-sm">Carregando...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </StyledTable>
            );
        }

        if (empty) {
            return (
                <StyledTable ref={ref}>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={colSpan} align="center" sx={{ py: 4 }}>
                                <EmptyState 
                                    title={emptyMessage || "Nenhum dado encontrado"}
                                    description={emptyDescription}
                                    variant="noData"
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </StyledTable>
            );
        }

        return (
            <StyledTable ref={ref}>
                {children}
            </StyledTable>
        );
    }
);

Table.displayName = "Table";

export default Table;

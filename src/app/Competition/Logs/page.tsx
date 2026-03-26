"use client"

import type React from "react"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import useLogs from "./hooks/useLogs"
import { TableSkeleton } from "@/components/_ui/Skeleton/TableSkeleton"

/**
 * Competition Logs Page Component
 * 
 * Displays all individual log entries for the active competition.
 * Shows action time, team name, user name, action description, and IP address.
 */
const CompetitionLogsPage: React.FC = () => {
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, rows, columns, isLoading } = useLogs()

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
        Logs da Competição
      </Typography>

      {isLoading ? (
        <TableSkeleton columns={columns.length} rows={5} />
      ) : rows.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Typography variant="body1" color="textSecondary">
            Nenhum log encontrado para esta competição.
          </Typography>
        </Paper>
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
          <Table stickyHeader aria-label="logs table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
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
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
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
                    {columns.map((column) => {
                      const value = row[column.id]
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
                          {column.format && typeof value === "number" ? column.format(value) : value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Logs por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
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
  )
}

export default CompetitionLogsPage

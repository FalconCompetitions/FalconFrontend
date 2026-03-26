"use client";

import type React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Download, Check, X, FileSearch } from 'lucide-react';
import useManualCorrection from "./hooks/useManualCorrection";
import { TableSkeleton } from "@/components/_ui/Skeleton/TableSkeleton";

export default function ManualCorrection() {
  const {
    submissions,
    selectedSubmission,
    feedback,
    setFeedback,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    handleApprove,
    handleDownload,
    getStatusBadge,
    currentSubmissions,
    handleOpenRejectDialog,
    handleCloseRejectDialog,
    handleConfirmReject,
    isLoading,
  } = useManualCorrection();

  const handleChangePage = (_: unknown, newPage: number) => {
    setCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setItemsPerPage(Number.parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const columns: {
    id: string;
    label: string;
    minWidth: number;
    align?: "center" | "right" | "left" | "inherit" | "justify";
  }[] = [
    { id: "groupName", label: "Nome do Grupo", minWidth: 150, align: "center" },
    { id: "submissionTime", label: "Horário de Envio", minWidth: 180, align: "center" },
    { id: "status", label: "Status", minWidth: 120, align: "center" },
    { id: "errorType", label: "Tipo de Erro", minWidth: 150, align: "center" },
    { id: "fileName", label: "Arquivo", minWidth: 150, align: "center" },
    { id: "actions", label: "Ações", minWidth: 200, align: "center" },
  ];

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
        Correção Manual de Exercícios
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          textAlign: "center",
          color: "#666",
          fontSize: "0.95rem",
        }}
      >
        Revise e avalie manualmente as submissões dos exercícios das equipes
      </Typography>

      {isLoading ? (
        <TableSkeleton columns={6} rows={5} />
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
            maxHeight: "calc(100vh - 280px)",
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
              {currentSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 10,
                      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                    }}>
                      <div style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        backgroundColor: "#e9edee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <FileSearch size={32} color="#4F85A6" />
                      </div>
                      <Typography variant="subtitle1" sx={{ color: "#3f3c40", fontWeight: 600 }}>
                        Nenhuma submissão pendente
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#4F85A6", maxWidth: 300 }}>
                        As submissões que requerem correção manual aparecerão aqui.
                      </Typography>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentSubmissions.map((submission) => (
                  <TableRow
                    hover
                    key={submission.id}
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
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "15px",
                        fontWeight: 500,
                        py: 2.5,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      {submission.groupName}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "15px",
                        fontWeight: 500,
                        py: 2.5,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      {submission.submissionTime}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "15px",
                        fontWeight: 500,
                        py: 2.5,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      {getStatusBadge(submission.status)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "15px",
                        fontWeight: 500,
                        py: 2.5,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      {submission.errorType ? (
                        <span style={{ color: "#dc2626" }}>
                          {submission.errorType}
                        </span>
                      ) : (
                        <span style={{ color: "#999" }}>-</span>
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "15px",
                        fontWeight: 500,
                        py: 2.5,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          handleDownload(
                            submission.fileUrl,
                            submission.fileName
                          )
                        }
                        sx={{
                          textTransform: "none",
                          fontSize: "14px",
                          color: "#4F85A6",
                          borderColor: "#4F85A6",
                          "&:hover": {
                            backgroundColor: "rgba(79, 133, 166, 0.08)",
                            borderColor: "#4F85A6",
                          },
                        }}
                        startIcon={<Download size={16} />}
                      >
                        {submission.fileName}
                      </Button>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "15px",
                        fontWeight: 500,
                        py: 2.5,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        {submission.status === "pending" && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleApprove(submission.id)}
                              sx={{
                                textTransform: "none",
                                fontSize: "14px",
                                backgroundColor: "#16a34a",
                                color: "#fff",
                                "&:hover": {
                                  backgroundColor: "#15803d",
                                },
                              }}
                              startIcon={<Check size={16} />}
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleOpenRejectDialog(submission)}
                              sx={{
                                textTransform: "none",
                                fontSize: "14px",
                                backgroundColor: "#dc2626",
                                color: "#fff",
                                "&:hover": {
                                  backgroundColor: "#b91c1c",
                                },
                              }}
                              startIcon={<X size={16} />}
                            >
                              Reprovar
                            </Button>
                          </>
                        )}
                        {submission.status !== "pending" && (
                          <span style={{ fontSize: "14px", color: "#999" }}>
                            {submission.status === "approved"
                              ? "Já aprovado"
                              : "Já reprovado"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={submissions.length}
          rowsPerPage={itemsPerPage}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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

      <Dialog
        open={selectedSubmission !== null}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reprovar Exercício</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
            Informe o motivo da reprovação para o grupo{" "}
            <strong>{selectedSubmission?.groupName}</strong>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Ex: Erro de sintaxe, lógica incorreta, timeout..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            variant="outlined"
            label="Tipo de Erro"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseRejectDialog}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmReject}
            variant="contained"
            disabled={!feedback.trim()}
            sx={{
              textTransform: "none",
              backgroundColor: "#dc2626",
              "&:hover": {
                backgroundColor: "#b91c1c",
              },
              "&:disabled": {
                backgroundColor: "rgba(220, 38, 38, 0.5)",
              },
            }}
          >
            Reprovar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

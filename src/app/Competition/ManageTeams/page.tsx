"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
} from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import BlockIcon from "@mui/icons-material/Block"
import DeleteIcon from "@mui/icons-material/Delete"
import useManageTeams from "./hooks/useManageTeams"
import { TableSkeleton } from "@/components/_ui/Skeleton/TableSkeleton"
import { ConfirmDialog } from "@/components/_ui/ConfirmDialog"

interface TeamToDelete {
  id: number
  teamName: string
}

const ManageTeamsPage: React.FC = () => {
  const {
    page,
    rowsPerPage,
    teams,
    columns,
    handleChangePage,
    handleChangeRowsPerPage,
    handleToggleStatus,
    handleDeleteTeam,
    isLoading,
  } = useManageTeams()

  const [teamToDelete, setTeamToDelete] = useState<TeamToDelete | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (team: TeamToDelete) => {
    setTeamToDelete(team)
  }

  const handleConfirmDelete = async () => {
    if (!teamToDelete) return
    setIsDeleting(true)
    try {
      await handleDeleteTeam(teamToDelete.id)
    } finally {
      setIsDeleting(false)
      setTeamToDelete(null)
    }
  }

  return (
    <>
      <ConfirmDialog
        isOpen={!!teamToDelete}
        onClose={() => setTeamToDelete(null)}
        title="Excluir Equipe"
        description={`Tem certeza que deseja excluir a equipe "${teamToDelete?.teamName}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <Typography
        variant="h5"
        component="div"
        sx={{
          mb: 3,
          textAlign: "center",
          color: "#4F85A6",
          fontWeight: "bold",
          fontSize: "32px",
          letterSpacing: "0.5px",
          textShadow: "0 2px 4px rgba(79, 133, 166, 0.1)",
        }}
      >
        Gerenciamento de Equipes
      </Typography>

      {isLoading ? (
        <TableSkeleton columns={columns.length} rows={5} />
      ) : (
      <Paper
        sx={{
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 600,
            "&::-webkit-scrollbar": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#4F85A6",
              borderRadius: "10px",
              "&:hover": {
                background: "#3d6a85",
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
                      backgroundColor: "#4F85A6",
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: "600",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((team) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={team.id}
                    sx={{
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(79, 133, 166, 0.04)",
                      },
                      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    {columns.map((column) => {
                      const value = team[column.id as keyof typeof team]
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{
                            fontSize: "14px",
                            padding: "12px 16px",
                          }}
                        >
                          {column.id === "status" ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  team.status === "active" ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontWeight: "500",
                                fontSize: "13px",
                              }}
                            >
                              {team.status === "active" ? (
                                <>
                                  <CheckCircleIcon
                                    color="success"
                                    sx={{
                                      mr: 0.5,
                                      fontSize: "18px",
                                    }}
                                  />{" "}
                                  Ativo
                                </>
                              ) : (
                                <>
                                  <BlockIcon
                                    color="error"
                                    sx={{
                                      mr: 0.5,
                                      fontSize: "18px",
                                    }}
                                  />{" "}
                                  Bloqueado
                                </>
                              )}
                            </Box>
                          ) : column.id === "actions" ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                variant="outlined"
                                color={team.status === "active" ? "error" : "success"}
                                onClick={() => handleToggleStatus(team.id)}
                                startIcon={team.status === "active" ? <BlockIcon /> : <CheckCircleIcon />}
                                size="small"
                                sx={{
                                  borderRadius: "8px",
                                  textTransform: "none",
                                  fontWeight: "500",
                                  fontSize: "13px",
                                  padding: "5px 14px",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                                  },
                                }}
                              >
                                {team.status === "active" ? "Bloquear" : "Ativar"}
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleDeleteClick({ id: team.id, teamName: team.teamName })}
                                startIcon={<DeleteIcon />}
                                size="small"
                                sx={{
                                  borderRadius: "8px",
                                  textTransform: "none",
                                  fontWeight: "500",
                                  fontSize: "13px",
                                  padding: "5px 14px",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                                  },
                                }}
                              >
                                Excluir
                              </Button>
                            </Box>
                          ) : (
                            value
                          )}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={teams.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          labelRowsPerPage="Linhas por página:"
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: "14px",
              fontWeight: "500",
            },
            "& .MuiTablePagination-select": {
              borderRadius: "6px",
              fontSize: "14px",
            },
            "& .MuiIconButton-root": {
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(79, 133, 166, 0.08)",
                transform: "scale(1.05)",
              },
            },
          }}
        />
      </Paper>
      )}
    </>
  )
}

export default ManageTeamsPage

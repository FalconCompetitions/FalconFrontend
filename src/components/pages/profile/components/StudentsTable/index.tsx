"use client";

import { FC, useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/_ui/Card";
import { ButtonAdm } from "@/components/_ui/ButtonAdm";
import { Badge } from "@/components/_ui/Badge";
import Input from "@/components/_ui/Input";
import { Checkbox } from "@/components/_ui/Checkbox";
import { Avatar, AvatarFallback } from "@/components/_ui/Avatar";
import { Edit, Trash2, Download, Search, Filter, X, ChevronDown } from "lucide-react";
import useStudentsTable from "./hooks/useStudentsTable";
import Table from "@/components/_ui/Table";
import TableHead from "@/components/_ui/Table/components/TableHeader";
import TableRow from "@/components/_ui/Table/components/TableRow";
import TableCell from "@/components/_ui/Table/components/TableCell";
import TableBody from "@/components/_ui/Table/components/TableBody";
import TableFooter from "@/components/_ui/Table/components/TableFooter";
import { TablePagination } from "@mui/material";
import TablePaginationActions from "@/components/_ui/Table/components/TablePagination";
import Loading from "@/components/_ui/Loading";
import DeleteDialog from "../../_modules/Shared/DeleteDialog";
import EditUserDialog from "../../_modules/Shared/EditUserDialog";
import Button from "@/components/_ui/Button";
import CompetitionService from "@/services/CompetitionService";
import type { Competition, CompetitionDetail, CompetitionDetailUser } from "@/types/Competition";

const StudentsTable: FC = () => {
    const {
        users,
        allUsersSelected,
        loadingUsers,
        deleteDialog,
        editDialog,
        currentPage,
        totalPages,
        searchTerm,
        setSearchTerm,
        togglePage,
        selectedUsers,
        handleSelectAll,
        handleSelectUser,
        handleDeleteUserClick,
        handleSelectUserToEdit,
        handleDeleteUsers,
    } = useStudentsTable();

    const currentDate = new Date();

    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

    // Competition filter state
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [selectedCompetition, setSelectedCompetition] = useState<CompetitionDetail | null>(null);
    const [filteredByCompetition, setFilteredByCompetition] = useState<CompetitionDetailUser[]>([]);
    const [loadingCompetitions, setLoadingCompetitions] = useState(false);
    const [loadingCompetitionDetail, setLoadingCompetitionDetail] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOpenCompetitionFilter = async () => {
        if (dropdownOpen) {
            setDropdownOpen(false);
            return;
        }
        if (competitions.length === 0) {
            setLoadingCompetitions(true);
            try {
                const res = await CompetitionService.getFinishedCompetitions();
                setCompetitions(res.data ?? []);
            } catch {
                setCompetitions([]);
            } finally {
                setLoadingCompetitions(false);
            }
        }
        setDropdownOpen(true);
    };

    const handleSelectCompetition = async (competition: Competition) => {
        setDropdownOpen(false);
        setLoadingCompetitionDetail(true);
        try {
            const res = await CompetitionService.getCompetitionById(competition.id);
            const detail = res.data ?? null;
            setSelectedCompetition(detail);
            const students = (detail?.groups ?? []).flatMap(g => g.users ?? []);
            setFilteredByCompetition(students);
        } catch {
            setFilteredByCompetition([]);
        } finally {
            setLoadingCompetitionDetail(false);
        }
    };

    const handleClearFilter = () => {
        setSelectedCompetition(null);
        setFilteredByCompetition([]);
    };

    const competitionStudents = selectedCompetition
        ? filteredByCompetition.filter(u =>
            searchTerm === "" ||
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.ra ?? "").toLowerCase().includes(searchTerm.toLowerCase())
          )
        : null;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <>
            {deleteDialog.isOpen && (
                <DeleteDialog
                    isOpen={deleteDialog.isOpen}
                    onClose={deleteDialog.toggleDialog!}
                    onConfirm={() => deleteDialog.action!(deleteDialog.user!.id)}
                    itemName={deleteDialog.user!.name}
                    itemType="Aluno"
                />
            )}

            {editDialog.isOpen && editDialog.action && (
                <EditUserDialog
                    isOpen={editDialog.isOpen}
                    onClose={editDialog.toggleDialog!}
                    toggleDialog={editDialog.toggleDialog!}
                    onConfirm={editDialog.action}
                    user={{
                        id: editDialog.user!.id,
                        name: editDialog.user!.name,
                        email: editDialog.user!.email,
                        status: 1,
                        groupId: editDialog.user!.group?.id,
                        joinYear: editDialog.user!.joinYear,
                        department: editDialog.user!.department,
                        group: editDialog.user!.group,
                    }}
                />
            )}

            {isBulkDeleteDialogOpen && (
                <DeleteDialog
                    isOpen={isBulkDeleteDialogOpen}
                    onClose={() => setIsBulkDeleteDialogOpen(false)}
                    onConfirm={handleDeleteUsers}
                    itemName={`os ${selectedUsers.length} aluno(s) selecionado(s)`}
                    itemType="item"
                />
            )}


            <Card className="bg-white border-[#e9edee] shadow-sm">
                <CardHeader>
                     <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-3xl text-[#3f3c40]">
                                Gerenciar Alunos
                            </CardTitle>
                            <CardDescription className="text-xl text-[#4F85A6]">
                                Lista completa de alunos cadastrados
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Competition filter dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                {selectedCompetition ? (
                                    <ButtonAdm
                                        variant="outline"
                                        size="sm"
                                        onClick={handleClearFilter}
                                        className="border-[#4F85A6] text-[#4F85A6] hover:bg-red-50 hover:border-red-400 hover:text-red-500 bg-[#4F85A6] bg-opacity-10"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        {selectedCompetition.name}
                                    </ButtonAdm>
                                ) : (
                                    <ButtonAdm
                                        variant="outline"
                                        size="sm"
                                        onClick={handleOpenCompetitionFilter}
                                        className="border-[#4F85A6] text-[#4F85A6] hover:bg-[#9abbd6] hover:text-white bg-transparent"
                                    >
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filtrar por Maratona
                                        <ChevronDown className="w-4 h-4 ml-1" />
                                    </ButtonAdm>
                                )}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-1 w-72 bg-white border border-[#e9edee] rounded-lg shadow-lg z-50">
                                        {loadingCompetitions ? (
                                            <div className="p-4 text-center text-[#4F85A6] text-sm">Carregando...</div>
                                        ) : competitions.length === 0 ? (
                                            <div className="p-4 text-center text-[#3f3c40] text-sm">Nenhuma maratona cadastrada.</div>
                                        ) : (
                                            <ul className="py-1 max-h-60 overflow-y-auto">
                                                {competitions.map(c => (
                                                    <li key={c.id}>
                                                        <button
                                                            onClick={() => handleSelectCompetition(c)}
                                                            className="w-full text-left px-4 py-2 text-sm text-[#3f3c40] hover:bg-[#e9edee] transition-colors"
                                                        >
                                                            <div className="font-medium">{c.name}</div>
                                                            {c.startTime && (
                                                                <div className="text-xs text-[#4F85A6]">
                                                                    {new Date(c.startTime).toLocaleDateString("pt-BR")}
                                                                </div>
                                                            )}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>

                            <ButtonAdm
                                variant="outline"
                                size="sm"
                                className="border-[#4F85A6] text-[#4F85A6] hover:bg-[#9abbd6] hover:text-white bg-transparent"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exportar
                            </ButtonAdm>
                        </div>
                    </div>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4F85A6] w-5 h-5" />
                        <Input
                            placeholder="Buscar por nome, RA ou grupo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-base"
                            type="text"
                            name="search"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0 relative min-h-40">
                    {(loadingUsers || loadingCompetitionDetail) && <Loading variant="spinner" size="lg" />}

                    {/* Competition filter view */}
                    {competitionStudents !== null && !loadingCompetitionDetail && (
                        <div className="rounded-md border border-[#e9edee]">
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-[#e9edee] hover:bg-[#e9edee]">
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold">Aluno</TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold">RA</TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold">Grupo</TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold">Ano de Ingresso</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {competitionStudents.map((user) => {
                                        const group = selectedCompetition?.groups?.find(g => g.users?.some(u => u.id === user.id));
                                        return (
                                            <TableRow key={user.id} className="hover:bg-[#e9edee] hover:bg-opacity-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-9 h-9">
                                                            <AvatarFallback className="bg-[#9abbd6] text-white text-base">
                                                                {getInitials(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium text-base text-[#3f3c40]">{user.name}</div>
                                                            <div className="text-sm text-[#4F85A6]">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-base text-[#3f3c40]">{user.ra ?? "—"}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="border-[#9abbd6] text-base text-[#4F85A6] bg-[#9abbd6] bg-opacity-10">
                                                        {group?.name ?? "—"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-base text-[#3f3c40]">{user.joinYear ?? "—"}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            {competitionStudents.length === 0 && (
                                <div className="p-6 text-center text-[#3f3c40]">
                                    Nenhum aluno inscrito nesta maratona.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Default view (no competition filter) */}
                    {competitionStudents === null && users.length != 0 && !loadingUsers && (
                        <div className="rounded-md border border-[#e9edee]">
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-[#e9edee] hover:bg-[#e9edee]">
                                        <TableCell className="w-12 px-2">
                                            <Checkbox
                                                checked={
                                                    selectedUsers.length ===
                                                    users.length && users.length > 0
                                                }
                                                onClick={() =>
                                                    handleSelectAll(
                                                        !allUsersSelected
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold">
                                            Aluno
                                        </TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold">
                                            RA
                                        </TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold">
                                            Grupo
                                        </TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold">
                                            Status
                                        </TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold">
                                            Data de Ingresso
                                        </TableCell>
                                        <TableCell className="text-right text-lg text-[#3f3c40] font-semibold">
                                            <div className="flex justify-end items-center gap-2">
                                                <span>Ações</span>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setIsBulkDeleteDialogOpen(true)}
                                                    rounded
                                                    disabled={selectedUsers.length === 0}
                                                    className="transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="hover:bg-[#e9edee] hover:bg-opacity-50"
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedUsers.includes(
                                                        user.id
                                                    )}
                                                    onClick={() =>
                                                        handleSelectUser(
                                                            user.id,
                                                            !selectedUsers.includes(
                                                                user.id
                                                            )
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-3">
                                                    <Avatar className="w-9 h-9">
                                                        <AvatarFallback className="bg-[#9abbd6] text-white text-base">
                                                            {getInitials(
                                                                user.name
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-base text-[#3f3c40]">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-[#4F85A6]">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-base text-[#3f3c40]">
                                                {user.ra}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="border-[#9abbd6] text-base text-[#4F85A6] bg-[#9abbd6] bg-opacity-10"
                                                >
                                                    {user.group?.name ||
                                                        "-----"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={"outline"}
                                                    className={

                                                        currentDate.getTime() - new Date(user.lastLoggedAt).getTime() < 24 * 60 * 60 * 1000
                                                            ? "bg-[#4F85A6] text-white text-base"
                                                            : "bg-[#e9edee] text-[#3f3c40] text-base"
                                                    }
                                                >
                                                    {currentDate.getTime() - new Date(user.lastLoggedAt).getTime() < 24 * 60 * 60 * 1000
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-base text-[#3f3c40]">
                                                {user.joinYear}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleSelectUserToEdit(
                                                                user
                                                            )
                                                        }
                                                        rounded
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteUserClick(
                                                                user
                                                            )
                                                        }
                                                        rounded
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                     <TableRow className="w-full">
                                        <TablePagination
                                            count={users.length}
                                            page={currentPage - 1}
                                            onPageChange={(e, page) => {
                                                togglePage(page + 1);
                                            }}
                                            colSpan={7}
                                            rowsPerPage={10}
                                            rowsPerPageOptions={[]}
                                            className="border-t"
                                            slotProps={{
                                                select: {
                                                    inputProps: {
                                                        "aria-label":
                                                            "Linhas por página",
                                                    },
                                                    native: true,
                                                },
                                            }}
                                            ActionsComponent={
                                                TablePaginationActions
                                            }
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    )}

                    {competitionStudents === null && users.length === 0 && !loadingUsers && (
                        <div className="p-6 text-center text-[#3f3c40]">
                            Nenhum usuário encontrado.
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};
export default StudentsTable;
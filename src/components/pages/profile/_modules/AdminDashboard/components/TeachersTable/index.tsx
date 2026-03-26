"use client";

// 1. Importar o 'useState'
import { FC, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/_ui/Card";
import { ButtonAdm } from "@/components/_ui/ButtonAdm";
import Input from "@/components/_ui/Input";
import { Checkbox } from "@/components/_ui/Checkbox";
import { Avatar, AvatarFallback } from "@/components/_ui/Avatar";
import { Edit, Trash2, Download, Search } from "lucide-react";
import useTeachersTable from "./hooks/useTeachersTable";
import Table from "@/components/_ui/Table";
import TableHead from "@/components/_ui/Table/components/TableHeader";
import TableRow from "@/components/_ui/Table/components/TableRow";
import TableCell from "@/components/_ui/Table/components/TableCell";
import TableBody from "@/components/_ui/Table/components/TableBody";
import TableFooter from "@/components/_ui/Table/components/TableFooter";
import { TablePagination } from "@mui/material";
import TablePaginationActions from "@/components/_ui/Table/components/TablePagination";
import Loading from "@/components/_ui/Loading";
import DeleteDialog from "../../../../_modules/Shared/DeleteDialog";
import EditTeacherDialog from "../../../Shared/EditTeacherDialog";
import Button from "@/components/_ui/Button";

// Renomeado para refletir o conteúdo
const TeachersTable: FC = () => {
    const {
        users,
        allUsersSelected,
        loadingUsers,
        deleteDialog,
        editDialog,
        currentPage,
        searchTerm,
        setSearchTerm,
        togglePage,
        selectedUsers,
        handleSelectAll,
        handleSelectUser,
        handleDeleteUserClick,
        handleSelectUserToEdit,
        handleDeleteUsers,
    } = useTeachersTable();

    // 2. Adicionar o estado para o diálogo de exclusão em massa
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

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
                    itemType="Professor"
                />
            )}

            {editDialog.isOpen && editDialog.action && (
                <EditTeacherDialog
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
                        department: editDialog.user!.department,
                        joinYear: editDialog.user!.joinYear,
                    }}
                />
            )}

            {/* 3. Adicionar a instância do diálogo de exclusão em massa */}
            {isBulkDeleteDialogOpen && (
                <DeleteDialog
                    isOpen={isBulkDeleteDialogOpen}
                    onClose={() => setIsBulkDeleteDialogOpen(false)}
                    onConfirm={handleDeleteUsers}
                    itemName={`os ${selectedUsers.length} professor(es) selecionado(s)`}
                    itemType="item"
                />
            )}

            <Card className="bg-white border-[#e9edee] shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-3xl text-[#3f3c40]">
                                Gerenciar Professores
                            </CardTitle>
                            <CardDescription className="text-xl text-[#4F85A6]">
                                Lista completa de professores cadastrados
                                {selectedUsers.length > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-[#4F85A6] text-white text-sm rounded-full">
                                        {selectedUsers.length} selecionado{selectedUsers.length > 1 ? 's' : ''}
                                    </span>
                                )}
                            </CardDescription>
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
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4F85A6] w-5 h-5" />
                        <Input
                            placeholder="Buscar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-base"
                            type="text"
                            name="search"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0 relative min-h-40">
                    {loadingUsers && <Loading variant="spinner" size="lg" />}

                    {users.length != 0 && !loadingUsers && (
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
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold w-[25%]">
                                            Professor
                                        </TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold w-[15%]">
                                            Departamento
                                        </TableCell>
                                        
                                        <TableCell className="text-right text-lg text-[#3f3c40] font-semibold w-[15%]">
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
                                            className={`transition-colors ${
                                                selectedUsers.includes(user.id)
                                                    ? "bg-[#9abbd6]/20 border-l-4 border-l-[#4F85A6] hover:bg-[#9abbd6]/30"
                                                    : "hover:bg-[#e9edee] hover:bg-opacity-50"
                                            }`}
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
                                                {user.department || "Não definido"}
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
                                            colSpan={4}
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

                    {users.length === 0 && !loadingUsers && (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-[#e9edee] flex items-center justify-center">
                                <Search className="w-8 h-8 text-[#4F85A6]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#3f3c40] mb-2">
                                Nenhum professor encontrado
                            </h3>
                            <p className="text-sm text-[#4F85A6] max-w-sm">
                                {searchTerm 
                                    ? `Não encontramos resultados para "${searchTerm}". Tente ajustar sua busca.`
                                    : "Não há professores cadastrados no momento."
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};


export default TeachersTable;
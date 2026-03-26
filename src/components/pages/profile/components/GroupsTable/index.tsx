"use client";

import { FC, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/_ui/Card";
import { Badge } from "@/components/_ui/Badge";
import Input from "@/components/_ui/Input";
import { Checkbox } from "@/components/_ui/Checkbox";
import { Edit, Trash2, Download, Search } from "lucide-react";
import useGroupsTable from "./hooks/useGroupsTable";
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
import Button from "@/components/_ui/Button";
import EditGroupDialog from "../../_modules/Shared/EditGroupDialog";

const GroupsTable: FC = () => {
    const {
        groups,
        loadingGroups,
        allGroupsSelected,
        deleteDialog,
        editDialog,
        currentPage,
        totalGroups,
        togglePage,
        searchTerm,
        setSearchTerm,
        selectedGroups,
        handleSelectAll,
        handleSelectGroup,
        handleDeleteGroupClick,
        handleSelectGroupToEdit,
        handleDeleteGroups, 
    } = useGroupsTable();
    
   
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

    return (
        <>
            {deleteDialog.isOpen && deleteDialog.group && (
                <DeleteDialog
                    isOpen={deleteDialog.isOpen}
                    onClose={deleteDialog.toggleDialog!}
                    onConfirm={() =>
                        deleteDialog.action!(deleteDialog.group!.id)
                    }
                    itemName={deleteDialog.group.name}
                    itemType="Grupo"
                />
            )}
            
           
            {isBulkDeleteDialogOpen && (
                 <DeleteDialog
                    isOpen={isBulkDeleteDialogOpen}
                    onClose={() => setIsBulkDeleteDialogOpen(false)}
                    onConfirm={handleDeleteGroups} 
                    itemName={`os ${selectedGroups.length} grupo(s) selecionado(s)`}
                    itemType="item"
                />
            )}

            {editDialog.isOpen && editDialog.group && (
                <EditGroupDialog
                    isOpen={editDialog.isOpen}
                    onClose={editDialog.toggleDialog!}
                    onConfirm={editDialog.action!}
                    group={editDialog.group}
                    toggleDialog={editDialog.toggleDialog!}
                />
            )}

            <Card className="bg-white border-[#e9edee] shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-3xl text-[#3f3c40]">
                                Gerenciar Grupos
                            </CardTitle>
                            <CardDescription className="text-xl text-[#4F85A6]">
                                Lista completa de grupos cadastrados
                                {selectedGroups.length > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-[#4F85A6] text-white text-sm rounded-full">
                                        {selectedGroups.length} selecionado{selectedGroups.length > 1 ? 's' : ''}
                                    </span>
                                )}
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-[#4F85A6] text-[#4F85A6] hover:bg-[#9abbd6] hover:text-white bg-transparent"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                    </div>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4F85A6] w-5 h-5" />
                        <Input
                            placeholder="Buscar por nome do grupo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-base"
                            type="text"
                            name="search"
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0 relative min-h-40">
                    {loadingGroups && <Loading variant="spinner" size="lg" />}

                    {groups.length > 0 && !loadingGroups && (
                        <div className="rounded-md border border-[#e9edee]">
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-[#e9edee] hover:bg-[#e9edee]">
                                        <TableCell className="w-12 px-2">
                                            <Checkbox
                                                checked={allGroupsSelected}
                                                onClick={() =>
                                                    handleSelectAll(
                                                        !allGroupsSelected
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold w-[30%]">
                                            Grupo
                                        </TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold w-[15%]">
                                            Membros
                                        </TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold w-[15%]">
                                            Status
                                        </TableCell>
                                        <TableCell className="text-lg text-[#3f3c40] font-semibold w-[20%]">
                                            Última Competição
                                        </TableCell>
                                        
                                        <TableCell className="text-right text-lg text-[#3f3c40] font-semibold w-[20%]">
                                            <div className="flex justify-end items-center gap-2">
                                                <span>Ações</span>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setIsBulkDeleteDialogOpen(true)}
                                                    rounded
                                                    disabled={selectedGroups.length === 0}
                                                    className="transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {groups.map((group) => (
                                        <TableRow
                                            key={group.id}
                                            className={`transition-colors ${
                                                selectedGroups.includes(group.id)
                                                    ? "bg-[#9abbd6]/20 border-l-4 border-l-[#4F85A6] hover:bg-[#9abbd6]/30"
                                                    : "hover:bg-[#e9edee] hover:bg-opacity-50"
                                            }`}
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedGroups.includes(
                                                        group.id
                                                    )}
                                                    onClick={() =>
                                                        handleSelectGroup(
                                                            group.id,
                                                            !selectedGroups.includes(
                                                                group.id
                                                            )
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium text-base text-[#3f3c40]">
                                                {group.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="border-[#9abbd6] text-base text-[#4F85A6] bg-[#9abbd6] bg-opacity-10"
                                                >
                                                    {group.members} membros
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        group.status === "active"
                                                            ? "bg-[#4F85A6] text-white text-base"
                                                            : "bg-[#e9edee] text-[#3f3c40] text-base"
                                                    }
                                                >
                                                    {group.status === "active"
                                                        ? "Ativo"
                                                        : "Inativo"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-base text-[#3f3c40]">
                                                {group.lastCompetition 
                                                    ? new Date(group.lastCompetition).toLocaleDateString("pt-BR")
                                                    : "Sem competições"
                                                }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleSelectGroupToEdit(
                                                                group
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
                                                            handleDeleteGroupClick(
                                                                group
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
                                    <TableRow>
                                        <TablePagination
                                            count={totalGroups || 0}
                                            page={currentPage - 1}
                                            onPageChange={(e, page) =>
                                                togglePage(page + 1)
                                            }
                                            colSpan={6}
                                            rowsPerPage={10}
                                            rowsPerPageOptions={[]}
                                            className="border-t"
                                            ActionsComponent={
                                                TablePaginationActions
                                            }
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    )}

                    {groups.length === 0 && !loadingGroups && (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-[#e9edee] flex items-center justify-center">
                                <Search className="w-8 h-8 text-[#4F85A6]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#3f3c40] mb-2">
                                Nenhum grupo encontrado
                            </h3>
                            <p className="text-sm text-[#4F85A6] max-w-sm">
                                {searchTerm 
                                    ? `Não encontramos resultados para "${searchTerm}". Tente ajustar sua busca.`
                                    : "Não há grupos cadastrados no momento."
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default GroupsTable;


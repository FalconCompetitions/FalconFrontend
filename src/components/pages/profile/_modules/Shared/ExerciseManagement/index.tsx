"use client"

import type React from "react"
import { useRef, useState, useMemo } from "react"
import { FileText, Plus, Filter, Edit, Trash2, Search, Upload, AlertTriangle, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_ui/Card"
import Input from "@/components/_ui/Input"
import { ButtonAdm } from "@/components/_ui/ButtonAdm"
import { Badge } from "@/components/_ui/Badge"
import { useExerciseManagement } from "./hooks/useExerciseManagement"
import EditExerciseModal from "./components/EditExerciseModal"
import { exerciseTypeOptions } from "./constants"
import CustomDropdown from "@/components/_ui/Dropdown"
import type { ExerciseType } from "@/types/Exercise"
import { Textarea } from "@/components/_ui/Textarea"
import Loading from "@/components/_ui/Loading"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/Dialog"
import FileService from "@/services/FileService"
import { downloadBlobFile } from "@/libs/utils"
import { useSnackbar } from "notistack"
import { useUser } from "@/contexts/UserContext"

const ExerciseManagement: React.FC = () => {
  const {
    title,
    setTitle,
    type,
    setType,
    exerciseTypeFilter,
    toggleExerciseTypeFilter,
    searchTerm,
    setSearchTerm,
    showEditExerciseModal,
    toggleEditExerciseModal,
    editingExercise,
    handleCreateExercise,
    handleRemoveExercise,
    updatePdfFile,
    startEdit,
    handleUpdateFileChange,
    saveEdit,
    cancelEdit,
    exercises,
    getTypeColor,
    inputValues,
    setInputValues,
    outputValues,
    setOutputValues,
    pdfFile,
    handleFileChange,
    loadingExercises,
  } = useExerciseManagement()

  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useUser();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(exercises.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExercises = exercises.slice(startIndex, startIndex + itemsPerPage);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const exerciseTypeLabel = useMemo(() => {
    return exerciseTypeOptions.find((option) => option.value === exerciseTypeFilter)?.label ?? "Todos"
  }, [exerciseTypeFilter])

  const handleCreateWithValidation = () => {
    const duplicate = exercises.some((ex) => ex.title.trim().toLowerCase() === title.trim().toLowerCase())

    if (duplicate) {
      setDuplicateError("Já existe um exercício com esse nome!")
      return
    }

    setDuplicateError(null)
    handleCreateExercise()
  }

  const confirmDeleteExercise = () => {
    if (exerciseToDelete !== null) {
      handleRemoveExercise(exerciseToDelete)
      setExerciseToDelete(null)
      setConfirmDeleteOpen(false)
    }
  }

  const handleViewPdf = async (fileId: number) => {
    try {
      const file = await FileService.downloadFile(fileId, user?.token || "");
      
      downloadBlobFile(fileId, file.blob, file.contentDisposition);
    } catch (error: any) {
      console.error("Erro ao baixar o arquivo PDF:", error);
      
      const errorMessage = error?.response?.data?.Message || 
                          error?.message || 
                          "Erro ao baixar o arquivo PDF";
      
      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "bottom", horizontal: "right" }
      });
    }
  }

  return (
    <>
      <div className="flex-1">
        <div className="container mx-auto p-8 space-y-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#3f3c40] flex items-center gap-6">
                <FileText className="h-16 w-auto text-[#4F85A6]" />
                Gerenciar Exercícios
              </h1>
              <p className="text-2xl text-[#4F85A6] mt-4">Crie e gerencie exercícios para as competições</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-white border-[#e9edee] shadow-sm">
              <CardHeader className="pb-8">
                <CardTitle className="text-3xl text-[#3f3c40] flex items-center gap-4">
                  <FileText className="h-8 w-8 text-[#4F85A6]" />
                  Lista de Exercícios
                </CardTitle>
                <CardDescription className="text-xl text-[#4F85A6] mt-2">
                  Visualize e gerencie todos os exercícios cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <label className="text-xl font-medium text-[#3f3c40] mb-4 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-[#4F85A6]" />
                    Filtrar por Tipo
                  </label>
                  <CustomDropdown
                    // @ts-expect-error : Irrelevant
                    options={[{ label: "Todos", value: null }, ...exerciseTypeOptions]}
                    value={
                      [{ label: "Todos", value: null }, ...exerciseTypeOptions].find(
                        (option) => option.value === exerciseTypeFilter,
                      )?.value ?? null
                    }
                    // @ts-expect-error : Irrelevant
                    onChange={(val: ExerciseType) =>
                      toggleExerciseTypeFilter(
                        // @ts-expect-error : Irrelevant
                        [{ label: "Todos", value: null }, ...exerciseTypeOptions].find((option) => option.value === val)
                          ?.value ?? null,
                      )
                    }
                    type="normalDropdown"
                  />
                </div>
                <div>
                  <label className="text-xl font-medium text-[#3f3c40] mb-4 flex items-center gap-2">
                    <Search className="h-5 w-5 text-[#4F85A6]" />
                    Pesquisar Exercício
                  </label>
                  <Input
                    name="search"
                    type="text"
                    placeholder="Digite o nome do exercício..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-xl h-16 px-6"
                  />
                </div>

                <div className="min-h-32 border border-[#e9edee] rounded-lg p-6 space-y-4 relative">
                  {exercises.length === 0 && !loadingExercises && (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-[#9abbd6] mx-auto mb-4" />
                      <p className="text-xl text-[#4F85A6]">Nenhum exercício encontrado</p>
                      <p className="text-lg text-[#3f3c40] mt-2">
                        {exerciseTypeFilter === null
                          ? "Adicione um novo exercício"
                          : `Nenhum exercício do tipo "${exerciseTypeLabel}" encontrado.`}
                      </p>
                    </div>
                  )}

                  {!loadingExercises && currentExercises.length > 0 && (
                    <>
                      {currentExercises.map((exercise, index) => (
                        <div
                          key={`${exercise.id}-${index}`}
                          className="flex justify-between items-center p-4 border-b border-[#e9edee] rounded"
                        >
                          <div className="flex-1">
                            <h4 className="text-xl font-medium text-[#3f3c40] mb-2">{exercise.title}</h4>
                            <Badge
                              className={`${getTypeColor(
                                exercise.exerciseTypeId,
                              )} text-lg px-3 py-1 pointer-events-none`}
                            >
                              {exerciseTypeOptions.find((option) => option.value === exercise.exerciseTypeId)?.label}
                            </Badge>
                          </div>
                          <div className="flex space-x-3 ml-4">
                            <ButtonAdm
                              variant="ghost"
                              size="sm"
                              className="hover:bg-[#9abbd6]/20 text-[#4F85A6] p-3"
                              onClick={() => handleViewPdf(exercise.attachedFileId)}
                              title="Visualizar PDF"
                            >
                              <Eye className="w-5 h-5" />
                            </ButtonAdm>
                            <ButtonAdm
                              variant="ghost"
                              size="sm"
                              className="hover:bg-[#9abbd6]/20 text-[#4F85A6] p-3"
                              onClick={() => startEdit(exercise)}
                            >
                              <Edit className="w-5 h-5" />
                            </ButtonAdm>
                            <ButtonAdm
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-50 text-red-500 p-3"
                              onClick={() => {
                                setExerciseToDelete(exercises.indexOf(exercise))
                                setConfirmDeleteOpen(true)
                              }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </ButtonAdm>
                          </div>
                        </div>
                      ))}

                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                          <ButtonAdm
                            variant="outline"
                            className="px-4 py-2 text-white bg-[#4F85A6] hover:bg-[#3879a1]"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          >
                            Anterior
                          </ButtonAdm>

                          <span className="text-[#3f3c40] text-lg">
                            Página {currentPage} de {totalPages}
                          </span>

                          <ButtonAdm
                            variant="outline"
                            className="px-4 py-2 text-white bg-[#4F85A6] hover:bg-[#3879a1]"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          >
                            Próxima
                          </ButtonAdm>
                        </div>
                      )}
                    </>
                  )}

                  {loadingExercises && <Loading variant="spinner" size="md" />}
                </div>

                <div className="text-center">
                  <Badge variant="outline" className="text-lg px-4 py-2 border-[#4F85A6] text-[#4F85A6]">
                    Total: {exercises.length} exercício(s)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#e9edee] shadow-sm">
              <CardHeader className="pb-8">
                <CardTitle className="text-3xl text-[#3f3c40] flex items-center gap-4">
                  <Plus className="h-8 w-8 text-[#4F85A6]" />
                  Criar Novo Exercício
                </CardTitle>
                <CardDescription className="text-xl text-[#4F85A6] mt-2">
                  Adicione um novo exercício ao sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <label className="block text-xl font-medium text-[#3f3c40] mb-4">Título do Exercício</label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Digite o título do exercício"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-xl h-16 px-6"
                  />
                  {duplicateError && <p className="text-red-500 text-lg mt-2">{duplicateError}</p>}
                </div>

                <div>
                  <label className="block text-xl font-medium text-[#3f3c40] mb-4">Tipo do Exercício</label>
                  <CustomDropdown
                    options={exerciseTypeOptions}
                    value={type}
                    // @ts-expect-error : Irrelevant
                    onChange={(value: ExerciseType) => setType(value)}
                    type="normalDropdown"
                  />
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-medium text-[#3f3c40]">Conteúdo do Exercício</h4>
                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-[#3f3c40]">Anexo (PDF):</label>

                    <ButtonAdm
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-[#2f6b91] text-[#4F85A6] text-lg h-16 flex items-center justify-center transition-colors hover:bg-[#3b7192] hover:text-white"
                    >
                      <Upload className="w-5 h-5 mr-3" />
                      {pdfFile ? pdfFile.name : "Selecionar Arquivo PDF"}
                    </ButtonAdm>

                    <input
                      type="file"
                      accept=".pdf"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-[#3f3c40]">Valores de entrada:</label>
                    <Textarea
                      placeholder="Digite os valores de entrada (separados por linha, vírgula, etc.)"
                      value={inputValues}
                      onChange={(e) => setInputValues(e.target.value)}
                      className="border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-lg min-h-[120px] p-4"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-lg font-medium text-[#3f3c40]">Valores de saída:</label>
                    <Textarea
                      placeholder="Digite os valores de saída esperados (separados por linha, vírgula, etc.)"
                      value={outputValues}
                      onChange={(e) => setOutputValues(e.target.value)}
                      className="border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-lg min-h-[120px] p-4"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#e9edee]">
                  <ButtonAdm
                    onClick={handleCreateWithValidation}
                    disabled={!title.trim()}
                    className="w-full bg-[#4F85A6] hover:bg-[#3879a1] text-white disabled:opacity-50 disabled:cursor-not-allowed text-xl h-16"
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    Criar Exercício
                  </ButtonAdm>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showEditExerciseModal && editingExercise && (
        <EditExerciseModal
          open={showEditExerciseModal}
          onClose={toggleEditExerciseModal}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          editingExercise={editingExercise}
          handleFileChange={handleUpdateFileChange}
          pdfFile={updatePdfFile}
        />
      )}

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <AlertTriangle className="text-red-500 w-7 h-7" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-lg text-[#3f3c40] mt-3">
              Tem certeza que deseja excluir este exercício? Essa ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-4 mt-6">
            <ButtonAdm
              variant="outline"
              className="px-6 py-2 border-[#4F85A6] text-[#4F85A6] bg-transparent"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancelar
            </ButtonAdm>
            <ButtonAdm className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white" onClick={confirmDeleteExercise}>
              Excluir
            </ButtonAdm>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ExerciseManagement

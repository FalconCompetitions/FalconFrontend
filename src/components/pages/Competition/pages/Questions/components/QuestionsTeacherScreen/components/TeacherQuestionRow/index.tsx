"use client";

import React, { useState, useEffect, FC } from "react";
import {
    Box,
    Typography,
    TableCell,
    TableRow,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Question } from "../../../../types";
import { useQuestions } from "@/components/pages/Competition/contexts/QuestionsContext";
import { useSnackbar } from "notistack";

interface TeacherQuestionRowProps {
    question: Question;
}

const TeacherQuestionRow: FC<TeacherQuestionRowProps> = ({ question }) => {
    const { updateQuestion, editQuestion } = useQuestions();
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Determine if question is answered
    const isAnswered = question.answer !== null && question.answer !== undefined;
    const existingAnswer = typeof question.answer === 'string' 
        ? question.answer 
        : question.answer?.content || "";
    
    const [answerText, setAnswerText] = useState(existingAnswer);

    useEffect(() => {
        setAnswerText(existingAnswer);
    }, [existingAnswer]);

    const handleSubmitAnswer = () => {
        if (!answerText.trim()) {
            enqueueSnackbar("A resposta não pode estar vazia.", { variant: "warning" });
            return;
        }

        setSubmitting(true);

        const updatedQuestion = updateQuestion(question.id, answerText);

        setTimeout(() => {
            if (updatedQuestion) {
                editQuestion(updatedQuestion);
                enqueueSnackbar("Resposta enviada com sucesso!", { variant: "success" });
                setOpen(false);
            } else {
                enqueueSnackbar("Erro ao enviar a resposta.", { variant: "error" });
            }
            setSubmitting(false);
        }, 1000);
    };

    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell sx={{ textAlign: "center" }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontSize: "18px", textAlign: "center" }}
                >
                    {question.id}
                </TableCell>
                <TableCell sx={{ fontSize: "18px", textAlign: "center" }}>
                    {question.title}
                </TableCell>
                <TableCell sx={{ fontSize: "18px", textAlign: "center" }}>
                    {question.askedBy || question.userName || "N/A"}
                </TableCell>
                <TableCell sx={{ fontSize: "18px", textAlign: "center" }}>
                    {question.language || "N/A"}
                </TableCell>
                <TableCell sx={{ fontSize: "18px", textAlign: "center" }}>
                    {question.askedAt 
                        ? new Date(question.askedAt).toLocaleString("pt-BR")
                        : "N/A"}
                </TableCell>
                <TableCell sx={{ fontSize: "18px", textAlign: "center" }}>
                    <Box
                        component="span"
                        sx={{
                            p: 0.5,
                            borderRadius: 1,
                            fontWeight: "bold",
                            backgroundColor:
                                isAnswered ? "#c8e6c9" : "#ffeb3b",
                            color:
                                isAnswered ? "#2e7d32" : "#333",
                        }}
                    >
                        {isAnswered ? "Respondida" : "Pendente"}
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, p: 2 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                                sx={{ color: "#4F85A6", fontWeight: "bold" }}
                            >
                                Detalhes da Dúvida:
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 2,
                                    border: "1px solid #ccc",
                                    p: 2,
                                    borderRadius: 1,
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                {question.question || question.content}
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 1,
                                    color: "#4F85A6",
                                    fontWeight: "bold",
                                }}
                            >
                                Sua Resposta:
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                placeholder={
                                    isAnswered
                                        ? "Esta dúvida já foi respondida."
                                        : "Digite sua resposta aqui..."
                                }
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                disabled={isAnswered || submitting}
                                sx={{ mb: 2 }}
                            />

                            {isAnswered && typeof question.answer === 'object' && question.answer?.userName && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    Respondida por: {question.answer.userName}
                                    {question.answeredAt && ` em ${new Date(question.answeredAt).toLocaleString("pt-BR")}`}
                                </Typography>
                            )}
                            {isAnswered && (!question.answer || typeof question.answer === 'string') && question.answeredAt && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    Respondida em {new Date(question.answeredAt).toLocaleString("pt-BR")}
                                </Typography>
                            )}
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: "#4CAF50",
                                    "&:hover": {
                                        bgcolor: "#43A047",
                                    },
                                    width: "25%",
                                    display: "block",
                                    margin: "0 auto",
                                }}
                                onClick={handleSubmitAnswer}
                                disabled={
                                    isAnswered ||
                                    submitting ||
                                    !answerText.trim()
                                }
                            >
                                {submitting ? (
                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                ) : (
                                    "Enviar Resposta"
                                )}
                            </Button>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default TeacherQuestionRow;

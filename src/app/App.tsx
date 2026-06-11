import React, { useState, useEffect, useRef } from "react";
import devauraLogo from "@/imports/ChatGPT_Image_14_de_mai._de_2026__20_39_37-1.png";
import {
  Home, CalendarDays, CheckSquare, FolderOpen, Bell,
  Plus, Play, Pause, RotateCcw, Clock, Coffee,
  ChevronLeft, ChevronRight, GraduationCap, Check,
  Flame, Trophy, Target, TrendingUp, BookOpen, Upload,
  ClipboardList, File, Zap, X, MoreHorizontal, ChevronDown,
  Settings, Timer, AlertTriangle, User, LogOut,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────────
type ViewId = "home" | "calendar" | "tasks" | "quiz" | "files";
type TaskType = "exam" | "assignment" | "task";
type Priority = "high" | "medium" | "low";
type TimerMode = "focus" | "short" | "long";

interface Subject { id: string; name: string; short: string; color: string; bg: string; professor: string; days: string; time: string; }
interface Task { id: string; title: string; subjectId: string; type: TaskType; dueDate: string; priority: Priority; completed: boolean; }
interface CalEvent { date: string; title: string; type: "class" | "exam" | "assignment"; subjectId?: string; time?: string; }
interface FileItem { id: string; name: string; subjectId: string; ext: string; size: string; date: string; }
interface WeekDay { label: string; minutes: number; }
interface QuizQuestion { id: string; question: string; options: string[]; correct: number; }
interface Quiz { id: string; title: string; subjectId: string; questions: QuizQuestion[]; }

// ── Data ───────────────────────────────────────────────────────────────────────
const TODAY = "2026-05-22";

const SUBJECTS: Subject[] = [
  { id: "ihc-qui", name: "Interação Humano Computador e UX", short: "IHC", color: "#00ff41", bg: "rgba(0,255,65,0.12)", professor: "Prof. Charlene", days: "Qui", time: "19:00" },
  { id: "ihc-sex", name: "Interação Humano Computador e UX", short: "IHC", color: "#00ff41", bg: "rgba(0,255,65,0.12)", professor: "Prof. Marcone", days: "Sex", time: "19:00" },
  { id: "mca-seg", name: "Matemática Computacional Aplicada", short: "MCA", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", professor: "Prof. Leonardo Augusto", days: "Seg", time: "19:00" },
  { id: "mca-ter", name: "Matemática Computacional Aplicada", short: "MCA", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", professor: "Prof. Leonardo Benedito", days: "Ter", time: "19:00" },
];

const INIT_TASKS: Task[] = [
  { id: "t4", title: "Projeto Final — Análise de Dados com Python", subjectId: "mca-seg", type: "assignment", dueDate: "2026-05-28", priority: "medium", completed: false },
  { id: "t5", title: "Pesquisa — Design Thinking e UX Research", subjectId: "ihc-qui", type: "task", dueDate: "2026-05-22", priority: "low", completed: false },
  { id: "t7", title: "Prova — Cálculo Numérico Avançado", subjectId: "mca-seg", type: "exam", dueDate: "2026-06-03", priority: "medium", completed: false },
];

const EVENTS: CalEvent[] = [
  // ── Fevereiro 2026 ──────────────────────────────────────────────────────────
  { date: "2026-02-02", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-02-03", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-02-05", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-02-06", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-02-09", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-02-10", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-02-12", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-02-13", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-02-16", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-02-17", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-02-19", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-02-20", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-02-23", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-02-24", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-02-26", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-02-27", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  // ── Março 2026 ──────────────────────────────────────────────────────────────
  { date: "2026-03-02", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-03-03", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-03-05", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-03-06", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-03-09", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-03-10", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-03-12", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-03-13", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-03-16", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-03-17", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-03-19", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-03-20", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-03-23", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-03-24", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-03-26", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-03-27", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-03-30", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-03-31", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  // ── Abril 2026 ──────────────────────────────────────────────────────────────
  { date: "2026-04-02", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-04-03", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-04-06", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-04-07", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-04-09", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-04-10", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-04-13", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-04-14", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-04-16", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-04-17", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-04-20", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-04-21", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-04-23", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-04-24", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-04-27", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-04-28", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-04-30", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  // ── Maio 2026 ───────────────────────────────────────────────────────────────
  { date: "2026-05-01", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-05-04", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-05-05", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-05-07", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-05-08", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-05-11", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-05-12", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-05-14", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-05-15", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-05-18", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-05-19", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-05-21", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-05-22", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-05-22", title: "Pesquisa — Design Thinking e UX Research", type: "assignment", subjectId: "ihc-qui", time: "23:59" },
  { date: "2026-05-25", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-05-26", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-05-28", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-05-28", title: "Projeto Final — Análise de Dados com Python", type: "assignment", subjectId: "mca-seg", time: "23:59" },
  { date: "2026-05-29", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  // ── Junho 2026 ──────────────────────────────────────────────────────────────
  { date: "2026-06-01", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-06-02", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-06-03", title: "Prova — Cálculo Numérico Avançado", type: "exam", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-06-05", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-06-08", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-06-09", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-06-11", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-06-11", title: "Apresentação — Trabalho de UX", type: "exam", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-06-12", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-06-15", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-06-16", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-06-18", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-06-19", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-06-22", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-06-23", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-06-25", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-06-26", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-06-29", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-06-30", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  // ── Julho 2026 ──────────────────────────────────────────────────────────────
  { date: "2026-07-02", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-07-03", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
  { date: "2026-07-06", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-seg", time: "19:00" },
  { date: "2026-07-07", title: "Matemática Computacional Aplicada", type: "class", subjectId: "mca-ter", time: "19:00" },
  { date: "2026-07-09", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-qui", time: "19:00" },
  { date: "2026-07-10", title: "Interação Humano Computador e UX", type: "class", subjectId: "ihc-sex", time: "19:00" },
];

const INIT_FILES: FileItem[] = [];

const WEEKLY: WeekDay[] = [
  { label: "Seg", minutes: 120 }, { label: "Ter", minutes: 185 },
  { label: "Qua", minutes: 90 }, { label: "Qui", minutes: 210 },
  { label: "Sex", minutes: 150 }, { label: "Sáb", minutes: 60 }, { label: "Dom", minutes: 0 },
];

const QUIZZES: Quiz[] = [
  {
    id: "q1",
    title: "Heurísticas de Nielsen",
    subjectId: "ihc-qui",
    questions: [
      {
        id: "q1-1",
        question: "Qual heurística se refere à consistência e padrões na interface?",
        options: ["Visibilidade do status", "Consistência e padrões", "Prevenção de erros", "Flexibilidade"],
        correct: 1,
      },
      {
        id: "q1-2",
        question: "O que significa 'Correspondência entre sistema e mundo real'?",
        options: ["Usar linguagem técnica", "Usar linguagem familiar ao usuário", "Usar ícones abstratos", "Usar cores vibrantes"],
        correct: 1,
      },
      {
        id: "q1-3",
        question: "Qual heurística trata da capacidade de desfazer ações?",
        options: ["Controle e liberdade do usuário", "Prevenção de erros", "Ajuda e documentação", "Estética"],
        correct: 0,
      },
    ],
  },
  {
    id: "q2",
    title: "Princípios de UX Design",
    subjectId: "ihc-qui",
    questions: [
      {
        id: "q2-1",
        question: "O que é design centrado no usuário?",
        options: ["Focar na tecnologia", "Focar nas necessidades do usuário", "Focar no lucro", "Focar na estética"],
        correct: 1,
      },
      {
        id: "q2-2",
        question: "Qual é o objetivo principal do UX Research?",
        options: ["Criar interfaces bonitas", "Entender comportamento do usuário", "Programar features", "Vender produtos"],
        correct: 1,
      },
      {
        id: "q2-3",
        question: "O que é um wireframe?",
        options: ["Protótipo de alta fidelidade", "Esboço estrutural da interface", "Código final", "Teste de usabilidade"],
        correct: 1,
      },
    ],
  },
  {
    id: "q3",
    title: "Álgebra Linear",
    subjectId: "mca-seg",
    questions: [
      {
        id: "q3-1",
        question: "O que é um vetor unitário?",
        options: ["Vetor com módulo 1", "Vetor com módulo 0", "Vetor nulo", "Vetor perpendicular"],
        correct: 0,
      },
      {
        id: "q3-2",
        question: "Qual operação resulta em um escalar?",
        options: ["Produto vetorial", "Produto escalar", "Soma de vetores", "Subtração de vetores"],
        correct: 1,
      },
      {
        id: "q3-3",
        question: "O que representa o determinante de uma matriz?",
        options: ["Soma dos elementos", "Fator de escala da transformação", "Número de linhas", "Traço da matriz"],
        correct: 1,
      },
    ],
  },
  {
    id: "q4",
    title: "Métodos Numéricos",
    subjectId: "mca-seg",
    questions: [
      {
        id: "q4-1",
        question: "O que é o método de Newton-Raphson?",
        options: ["Método de integração", "Método para encontrar raízes", "Método de derivação", "Método de ordenação"],
        correct: 1,
      },
      {
        id: "q4-2",
        question: "Qual é a vantagem da interpolação de Lagrange?",
        options: ["Simplicidade conceitual", "Menor custo computacional", "Maior precisão sempre", "Não tem vantagens"],
        correct: 0,
      },
      {
        id: "q4-3",
        question: "O que significa convergência em métodos iterativos?",
        options: ["Divergir do resultado", "Aproximar-se da solução", "Repetir infinitamente", "Errar o cálculo"],
        correct: 1,
      },
    ],
  },
];

const TIMER_MODES: Record<TimerMode, { label: string; seconds: number; icon: React.ElementType }> = {
  focus: { label: "Foco", seconds: 25 * 60, icon: Zap },
  short: { label: "Pausa curta", seconds: 5 * 60, icon: Coffee },
  long: { label: "Pausa longa", seconds: 15 * 60, icon: Coffee },
};

const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MONTHS_FULL = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// ── Helpers ────────────────────────────────────────────────────────────────────
const getSubj = (id: string) => SUBJECTS.find((s) => s.id === id) ?? SUBJECTS[0];

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - new Date(TODAY).getTime()) / 86400000);
}

function formatDue(d: string): string {
  const n = daysUntil(d);
  if (n < 0) return "Atrasado";
  if (n === 0) return "Hoje";
  if (n === 1) return "Amanhã";
  return `${n}d`;
}

function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h === 0) return `${rem}min`;
  return `${h}h${rem > 0 ? `${rem}` : ""}`;
}

function formatTimer(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number) { return new Date(y, m, 1).getDay(); }

function dueColor(days: number) {
  if (days < 0) return "#1f7042";
  if (days <= 1) return "#1f7042";
  if (days <= 3) return "#1f7042";
  return "#64748b";
}

// ── Pill / Badge ───────────────────────────────────────────────────────────────
function TypeChip({ type }: { type: TaskType }) {
  const map: Record<TaskType, [string, string]> = {
    exam: ["#1f7042", "rgba(31,112,66,0.14)"],
    assignment: ["#1f7042", "rgba(31,112,66,0.14)"],
    task: ["#00ff41", "rgba(0,255,65,0.12)"],
  };
  const labels: Record<TaskType, string> = { exam: "Prova", assignment: "Trabalho", task: "Tarefa" };
  const [color, bg] = map[type];
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
      style={{ color, background: bg }}>
      {labels[type]}
    </span>
  );
}

// ── Notification dot ────────────────────────────────────────────────────────
function NotifDot({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
      style={{ background: "#f59e0b", color: "#fff", fontFamily: "DM Mono, monospace" }}>
      {count > 9 ? "9+" : count}
    </span>
  );
}

// ── Chart tooltip ──────────────────────────────────────────────────────────────
function ChartTip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-2.5 py-1.5 text-xs shadow-xl border border-border"
      style={{ background: "rgba(13,17,23,0.85)", fontFamily: "DM Mono, monospace" }}>
      <p className="text-muted-foreground">{label}</p>
      <p style={{ color: "#00ff41" }}>{formatMinutes(payload[0].value)}</p>
    </div>
  );
}

// ── Add Task Sheet ─────────────────────────────────────────────────────────────
function AddTaskSheet({ onAdd, onClose }: { onAdd: (t: Task) => void; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("calc");
  const [type, setType] = useState<TaskType>("task");
  const [dueDate, setDueDate] = useState("2026-05-25");
  const [priority, setPriority] = useState<Priority>("medium");

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ id: `t${Date.now()}`, title: title.trim(), subjectId, type, dueDate, priority, completed: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rounded-t-3xl p-6 pb-10 space-y-5" style={{ background: "rgba(13,17,23,0.85)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base" style={{ fontFamily: "Fraunces, Georgia, serif" }}>Nova tarefa</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="w-8 h-1 rounded-full mx-auto -mt-3" style={{ background: "rgba(255,255,255,0.15)" }} />

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da tarefa…"
          className="w-full rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Matéria</p>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-foreground outline-none [color-scheme:dark]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.short} — {s.name.split(" ")[0]}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Tipo</p>
            <select value={type} onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-foreground outline-none [color-scheme:dark]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <option value="task">Tarefa</option>
              <option value="exam">Prova</option>
              <option value="assignment">Trabalho</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Prazo</p>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-foreground outline-none [color-scheme:dark]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Prioridade</p>
            <div className="flex gap-2 pt-0.5">
              {(["high", "medium", "low"] as Priority[]).map((p) => {
                const colors: Record<Priority, string> = { high: "#1f7042", medium: "#1f7042", low: "#1f7042" };
                return (
                  <button key={p} onClick={() => setPriority(p)}
                    className="flex-1 h-9 rounded-xl transition-all"
                    style={{
                      background: priority === p ? `${colors[p]}25` : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${priority === p ? colors[p] : "rgba(255,255,255,0.08)"}`,
                    }}>
                    <span className="w-2.5 h-2.5 rounded-full block mx-auto" style={{ background: colors[p] }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button onClick={submit}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
          style={{ background: "#00ff41", color: "#000000" }}>
          Adicionar tarefa
        </button>
      </div>
    </div>
  );
}

// ── Study Carousel ─────────────────────────────────────────────────────────────
function StudyCarousel({ total, currentIdx, onElapsedChange }: { total: number; currentIdx: number; onElapsedChange: (s: number) => void }) {
  const [slide, setSlide] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [mode, setMode] = useState<"stopwatch" | "focus" | "break">("stopwatch");
  const [target, setTarget] = useState(25 * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  useEffect(() => {
    onElapsedChange(elapsed);
  }, [elapsed]);

  const reset = () => { setRunning(false); setElapsed(0); onElapsedChange(0); };

  const display = mode === "stopwatch"
    ? formatTimer(elapsed)
    : formatTimer(Math.max(0, target - elapsed));

  const progress = mode === "stopwatch"
    ? Math.min((elapsed / (60 * 60)) * 100, 100)
    : Math.min((elapsed / target) * 100, 100);

  const modes: { id: "stopwatch" | "focus" | "break"; label: string; seconds: number }[] = [
    { id: "stopwatch", label: "Crono", seconds: 0 },
    { id: "focus", label: "Foco 25'", seconds: 25 * 60 },
    { id: "break", label: "Pausa 5'", seconds: 5 * 60 },
  ];

  return (
    <div className="mx-5 mb-5">
      {/* Scrollable carousel */}
      <div className="flex overflow-x-auto gap-3 pb-1" style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const idx = Math.round(el.scrollLeft / el.offsetWidth);
          setSlide(idx);
        }}>
        {/* Slide 1 — gráfico */}
        <div className="flex-shrink-0 w-full rounded-2xl p-4" style={{ scrollSnapAlign: "start", background: "rgba(13,17,23,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-foreground">Estudo da semana</p>
            <p className="text-xs" style={{ color: "#00ff41", fontFamily: "DM Mono, monospace" }}>{formatMinutes(total)} total</p>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={WEEKLY} barCategoryGap="20%" margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(0,255,65,0.05)" }} />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                {WEEKLY.map((day, i) => (
                  <Cell key={`bar-${day.label}-${i}`} fill={i === currentIdx ? "#00ff41" : "rgba(0,255,65,0.2)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Slide 2 — timer */}
        <div className="flex-shrink-0 w-full rounded-2xl p-4" style={{ scrollSnapAlign: "start", background: "rgba(13,17,23,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-foreground">Timer de estudo</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: running ? "rgba(0,255,65,0.15)" : "rgba(255,255,255,0.06)", color: running ? "#00ff41" : "#64748b" }}>
              {running ? "● AO VIVO" : "PARADO"}
            </span>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1.5 mb-4">
            {modes.map(m => (
              <button key={m.id} onClick={() => { setMode(m.id); setTarget(m.seconds); reset(); }}
                className="flex-1 py-1.5 rounded-xl text-[10px] font-semibold transition-all"
                style={mode === m.id ? { background: "#00ff41", color: "#000" } : { background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Clock display */}
          <div className="flex items-center justify-center mb-3 relative">
            <svg className="absolute" width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(0,255,65,0.08)" strokeWidth="6" />
              <circle cx="48" cy="48" r="42" fill="none" stroke="#00ff41" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s ease", transformOrigin: "center", transform: "rotate(-90deg)" }} />
            </svg>
            <p className="text-2xl font-bold relative z-10" style={{ fontFamily: "DM Mono, monospace", color: "#00ff41" }}>{display}</p>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <button onClick={() => setRunning(r => !r)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{ background: "#00ff41", color: "#000" }}>
              {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {running ? "Pausar" : "Iniciar"}
            </button>
            <button onClick={reset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.06)", color: "#64748b" }}>
              <RotateCcw className="w-3.5 h-3.5" /> Resetar
            </button>
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-2">
        {[0, 1].map(i => (
          <span key={i} className="rounded-full transition-all" style={{
            width: slide === i ? 16 : 6, height: 6,
            background: slide === i ? "#00ff41" : "rgba(255,255,255,0.15)",
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Home View ──────────────────────────────────────────────────────────────────
function HomeView({ tasks, onGoTasks, onLogout }: { tasks: Task[]; onGoTasks: () => void; onLogout: () => void }) {
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pending = tasks.filter((t) => !t.completed);
  const urgent = pending.filter((t) => daysUntil(t.dueDate) <= 3);
  const todayClasses = EVENTS.filter((e) => e.date === TODAY && e.type === "class");
  const baseTotal = WEEKLY.reduce((a, w) => a + w.minutes, 0);
  const total = baseTotal + Math.floor(sessionElapsed / 60);
  const currentIdx = 4; // Friday

  return (
    <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
      {/* Hero greeting */}
      <div className="px-5 pt-2 pb-5 relative">
        <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: "DM Mono, monospace" }}>
          SEXTA · 22 MAI 2026
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{ background: "rgba(0,255,65,0.12)", border: "1px solid rgba(0,255,65,0.25)" }}>
              <User className="w-5 h-5" style={{ color: "#00ff41" }} />
            </button>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "Fraunces, Georgia, serif", color: "#00ff41" }}>
              Lucas
            </h1>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute top-12 left-0 z-50 rounded-2xl overflow-hidden shadow-xl"
                style={{ background: "rgba(13,17,23,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.09)", minWidth: "180px" }}>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left transition-all hover:bg-white/5 active:scale-98"
                  style={{ borderBottom: "none" }}>
                  <LogOut className="w-4 h-4" style={{ color: "#f43f5e" }} />
                  <span className="text-sm font-medium" style={{ color: "#f43f5e" }}>Sair</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.25)" }}>
            <Flame className="w-3.5 h-3.5" style={{ color: "#f43f5e" }} />
            <span className="text-xs font-bold" style={{ color: "#f43f5e", fontFamily: "DM Mono, monospace" }}>7</span>
            <span className="text-[11px] font-medium" style={{ color: "#f43f5e" }}>dias consecutivos</span>
          </div>
        </div>

        {/* Overlay to close menu */}
        {showUserMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </div>

      {/* Quick stats row */}
      <div className="flex gap-2.5 px-5 mb-5">
        {[
          { label: "Esta semana", value: formatMinutes(total), color: "#00ff41", bg: "rgba(0,255,65,0.08)", icon: Clock },
          { label: "Pendentes", value: String(pending.length), color: "#f59e0b", bg: "rgba(245,158,11,0.08)", icon: CheckSquare },
          { label: "Urgentes", value: String(urgent.length), color: "#f43f5e", bg: "rgba(244,63,94,0.08)", icon: AlertTriangle },
        ].map((s) => (
          <div key={s.label} className="flex-1 rounded-2xl p-3.5"
            style={{ background: s.bg, border: `1px solid ${s.color}20` }}>
            <s.icon className="w-4 h-4 mb-2.5" style={{ color: s.color }} />
            <p className="text-xl font-semibold" style={{ fontFamily: "DM Mono, monospace", color: s.color }}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly study carousel */}
      <StudyCarousel total={total} currentIdx={currentIdx} onElapsedChange={setSessionElapsed} />

      {/* Today's classes */}
      <div className="mx-5 mb-5">
        <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" style={{ color: "#00ff41" }} />
          Aulas de hoje
        </p>
        {todayClasses.length === 0 ? (
          <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(13,17,23,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <p className="text-sm text-muted-foreground">Sem aulas hoje 🎉</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayClasses.map((ev, i) => {
              const s = getSubj(ev.subjectId!);
              return (
                <div key={i} className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
                  style={{ background: s.bg, border: `1px solid ${s.color}25` }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ background: `${s.color}20`, color: s.color }}>
                    {s.short}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.professor}</p>
                  </div>
                  <p className="text-xs font-medium" style={{ color: s.color, fontFamily: "DM Mono, monospace" }}>{ev.time}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Calendar View ─────────────────────────────────────────────────────────────
function CalendarView() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4);
  const [selected, setSelected] = useState(TODAY);

  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const blanks = Array.from({ length: firstDay });
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const eventsOn = (dateStr: string) => EVENTS.filter((e) => e.date === dateStr);
  const selectedEvs = eventsOn(selected);

  const prevM = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextM = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const evColor = (type: CalEvent["type"], sid?: string) => {
    if (type === "exam") return "#1f7042";
    if (sid) return getSubj(sid).color;
    return "#64748b";
  };

  return (
    <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
      {/* Month nav */}
      <div className="flex items-center justify-between px-5 pt-2 pb-4">
        <button onClick={prevM} className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
          {MONTHS_FULL[month]} <span style={{ color: "#00ff41" }}>{year}</span>
        </h2>
        <button onClick={nextM} className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)" }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Week header */}
      <div className="grid grid-cols-7 px-5 mb-1">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <div key={i} className="text-center text-[11px] font-medium text-muted-foreground py-1"
            style={{ fontFamily: "DM Mono, monospace" }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 px-5 mb-5">
        {blanks.map((_, i) => <div key={`b${i}`} />)}
        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const evs = eventsOn(dateStr);
          const isToday = dateStr === TODAY;
          const isSel = dateStr === selected;
          const hasExam = evs.some(e => e.type === "exam");

          return (
            <button key={day} onClick={() => setSelected(dateStr)}
              className="flex flex-col items-center py-1.5 rounded-xl transition-all relative"
              style={{ background: isSel && !isToday ? "rgba(0,255,65,0.1)" : "transparent" }}>
              <span className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mb-0.5 transition-all"
                style={isToday
                  ? { background: "#00ff41", color: "#000000", fontFamily: "DM Mono, monospace" }
                  : { color: isSel ? "#00ff41" : "#e2e8f0", fontFamily: "DM Mono, monospace" }}>
                {day}
              </span>
              <div className="flex gap-0.5 flex-wrap justify-center max-w-6">
                {evs.slice(0, 3).map((ev, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: evColor(ev.type, ev.subjectId) }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Events for selected date */}
      <div className="mx-5">
        <p className="text-xs font-semibold text-foreground mb-3" style={{ fontFamily: "DM Mono, monospace" }}>
          {selected.split("-").reverse().join("/")}
        </p>
        {selectedEvs.length === 0 ? (
          <div className="rounded-2xl p-5 text-center" style={{ background: "rgba(13,17,23,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <p className="text-sm text-muted-foreground">Nenhum evento</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedEvs.map((ev, i) => {
              const color = evColor(ev.type, ev.subjectId);
              const s = ev.subjectId ? getSubj(ev.subjectId) : null;
              return (
                <div key={i} className="rounded-2xl px-4 py-4 flex items-start gap-3"
                  style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
                  <div className="w-1 h-full rounded-full mt-1 flex-shrink-0" style={{ background: color, minHeight: "32px" }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {ev.type === "exam" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(244,63,94,0.2)", color: "#f43f5e" }}>PROVA</span>
                      )}
                      {ev.type === "assignment" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(245,158,11,0.2)", color: "#f59e0b" }}>ENTREGA</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{ev.title}</p>
                    {s && <p className="text-xs text-muted-foreground mt-0.5">{s.professor}</p>}
                  </div>
                  <p className="text-xs font-medium flex-shrink-0" style={{ color, fontFamily: "DM Mono, monospace" }}>{ev.time}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tasks View ─────────────────────────────────────────────────────────────────
function TasksView({ tasks, setTasks, onAdd }: { tasks: Task[]; setTasks: (t: Task[]) => void; onAdd: () => void }) {
  const [filter, setFilter] = useState<"all" | TaskType>("all");

  const filtered = tasks
    .filter((t) => filter === "all" || t.type === filter)
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const toggle = (id: string) => setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const filterTabs: { id: "all" | TaskType; label: string }[] = [
    { id: "all", label: "Todas" },
    { id: "exam", label: "Provas" },
    { id: "assignment", label: "Trabalhos" },
    { id: "task", label: "Tarefas" },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
      {/* Stats */}
      <div className="px-5 pt-2 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            {tasks.filter(t => !t.completed).length} pendentes · {tasks.filter(t => t.completed).length} concluídas
          </p>
        </div>
        <button onClick={onAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold active:scale-95 transition-all"
          style={{ background: "#00ff41", color: "#000000" }}>
          <Plus className="w-3.5 h-3.5" /> Nova
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-5 mb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {filterTabs.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={filter === f.id
              ? { background: "#00ff41", color: "#000000" }
              : { background: "rgba(0,255,65,0.1)", color: "#64748b" }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="px-5 space-y-2.5">
        {filtered.map((task) => {
          const s = getSubj(task.subjectId);
          const d = daysUntil(task.dueDate);
          const priorityColors: Record<Priority, string> = { high: "#1f7042", medium: "#1f7042", low: "#1f7042" };

          return (
            <div key={task.id} className="rounded-2xl px-4 py-4 flex items-start gap-3 transition-all"
              style={{
                background: "rgba(13,17,23,0.45)",
                border: "1px solid rgba(255,255,255,0.09)",
                opacity: task.completed ? 0.55 : 1,
              }}>
              {/* Complete button */}
              <button onClick={() => toggle(task.id)}
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all active:scale-90"
                style={{
                  borderColor: task.completed ? "#1f7042" : s.color,
                  background: task.completed ? "#1f7042" : "transparent",
                }}>
                {task.completed && <Check className="w-3 h-3" style={{ color: "#0d1117" }} />}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-snug ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: s.bg, color: s.color }}>
                    {s.short}
                  </span>
                  <TypeChip type={task.type} />
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: priorityColors[task.priority] }} />
                  {!task.completed && (
                    <span className="text-[11px] font-semibold ml-auto"
                      style={{ color: dueColor(d), fontFamily: "DM Mono, monospace" }}>
                      {formatDue(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Quiz View ──────────────────────────────────────────────────────────────────
function QuizView() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === selectedQuiz!.questions[currentQ].correct) {
      setScore(score + 1);
    }

    if (currentQ + 1 < selectedQuiz!.questions.length) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  if (!selectedQuiz) {
    return (
      <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
        <div className="px-5 pt-2 pb-4">
          <p className="text-xs text-muted-foreground">{QUIZZES.length} questionários disponíveis</p>
        </div>

        <div className="px-5 space-y-3">
          {QUIZZES.map((quiz) => {
            const subj = getSubj(quiz.subjectId);
            return (
              <button key={quiz.id} onClick={() => setSelectedQuiz(quiz)}
                className="w-full rounded-2xl px-4 py-4 flex items-center gap-3 transition-all active:scale-98"
                style={{ background: "rgba(13,17,23,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: subj.bg }}>
                  <ClipboardList className="w-5 h-5" style={{ color: subj.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{quiz.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: subj.bg, color: subj.color }}>
                      {subj.short}
                    </span>
                    <span className="text-xs text-muted-foreground">{quiz.questions.length} questões</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    const subj = getSubj(selectedQuiz.subjectId);
    return (
      <div className="flex-1 overflow-y-auto pb-4 flex flex-col items-center justify-center px-5" style={{ scrollbarWidth: "none" }}>
        <div className="w-full max-w-xs text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: percentage >= 70 ? "rgba(0,255,65,0.15)" : "rgba(244,63,94,0.15)" }}>
            <Trophy className="w-12 h-12" style={{ color: percentage >= 70 ? "#00ff41" : "#f43f5e" }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
            {percentage >= 70 ? "Parabéns!" : "Continue estudando!"}
          </h3>
          <p className="text-3xl font-bold mb-1" style={{ color: percentage >= 70 ? "#00ff41" : "#f43f5e", fontFamily: "DM Mono, monospace" }}>
            {percentage}%
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {score} de {selectedQuiz.questions.length} questões corretas
          </p>
          <button onClick={resetQuiz}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
            style={{ background: "#00ff41", color: "#000000" }}>
            Voltar aos questionários
          </button>
        </div>
      </div>
    );
  }

  const question = selectedQuiz.questions[currentQ];
  const subj = getSubj(selectedQuiz.subjectId);

  return (
    <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
      <div className="px-5 pt-2 pb-4">
        <button onClick={resetQuiz} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <ChevronLeft className="w-3.5 h-3.5" />
          Voltar
        </button>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
            {selectedQuiz.title}
          </h3>
          <span className="text-xs font-semibold" style={{ color: subj.color, fontFamily: "DM Mono, monospace" }}>
            {currentQ + 1}/{selectedQuiz.questions.length}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="h-full rounded-full transition-all"
            style={{
              width: `${((currentQ + 1) / selectedQuiz.questions.length) * 100}%`,
              background: subj.color
            }} />
        </div>
      </div>

      <div className="px-5">
        <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(13,17,23,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <p className="text-base font-medium text-foreground leading-relaxed">
            {question.question}
          </p>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button key={idx} onClick={() => handleAnswer(idx)}
              className="w-full rounded-2xl px-4 py-4 text-left transition-all active:scale-98"
              style={{
                background: selectedAnswer === idx ? subj.bg : "rgba(13,17,23,0.45)",
                border: selectedAnswer === idx ? `2px solid ${subj.color}` : "1px solid rgba(255,255,255,0.07)",
              }}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: selectedAnswer === idx ? subj.color : "rgba(255,255,255,0.05)",
                    border: selectedAnswer === idx ? "none" : "1.5px solid rgba(255,255,255,0.15)",
                  }}>
                  {selectedAnswer === idx && (
                    <Check className="w-3.5 h-3.5" style={{ color: "#0d1117" }} />
                  )}
                </div>
                <span className="text-sm text-foreground flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>

        <button onClick={nextQuestion} disabled={selectedAnswer === null}
          className="w-full mt-6 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          style={{ background: "#00ff41", color: "#000000" }}>
          {currentQ + 1 < selectedQuiz.questions.length ? "Próxima questão" : "Finalizar"}
        </button>
      </div>
    </div>
  );
}

// ── Files View ─────────────────────────────────────────────────────────────────
// ── Files View ─────────────────────────────────────────────────────────────────
const FILE_SUBJECTS = [
  { id: "mca", name: "Matemática Computacional Aplicada", short: "MCA", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { id: "ihc", name: "Interação Humano Computador e UX", short: "IHC", color: "#00ff41", bg: "rgba(0,255,65,0.12)" },
];

interface Folder { id: string; name: string; subjectId: string; count: number; }

const FOLDERS: Folder[] = [
  { id: "folder-1", name: "Teoria das Cores", subjectId: "ihc", count: 0 },
  { id: "folder-2", name: "Heurísticas", subjectId: "ihc", count: 0 },
  { id: "folder-3", name: "Lógica Booleana", subjectId: "mca", count: 0 },
];

function FilesView() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? FOLDERS : FOLDERS.filter((f) => f.subjectId === filter);

  return (
    <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
      <div className="px-5 pt-2 pb-4">
        <p className="text-xs text-muted-foreground">{filtered.length} pasta{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Subject filter */}
      <div className="flex gap-2 px-5 mb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <button onClick={() => setFilter("all")}
          className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={filter === "all" ? { background: "#00ff41", color: "#000000" } : { background: "rgba(0,255,65,0.1)", color: "#64748b" }}>
          Todos
        </button>
        {FILE_SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setFilter(s.id)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={filter === s.id ? { background: s.color, color: "#0d1117" } : { background: s.bg, color: s.color }}>
            {s.short}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-2.5">
        {filtered.map((folder) => {
          const subj = FILE_SUBJECTS.find(s => s.id === folder.subjectId) ?? FILE_SUBJECTS[0];
          return (
            <div key={folder.id} className="rounded-2xl px-4 py-4 flex items-center gap-3 active:scale-[0.98] transition-all"
              style={{ background: "rgba(13,17,23,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: subj.bg }}>
                <FolderOpen className="w-6 h-6" style={{ color: subj.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{folder.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: subj.bg, color: subj.color }}>
                    {subj.short}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{folder.count} arquivo{folder.count !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: ViewId; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "calendar", label: "Agenda", icon: CalendarDays },
  { id: "tasks", label: "Tarefas", icon: CheckSquare },
  { id: "quiz", label: "Quiz", icon: ClipboardList },
  { id: "files", label: "Arquivos", icon: FolderOpen },
];

function BottomNav({ active, onNav, badge }: { active: ViewId; onNav: (v: ViewId) => void; badge: number }) {
  return (
    <nav className="flex-shrink-0 flex items-center justify-around px-2 pt-2 pb-safe"
      style={{
        background: "rgba(0,255,65,0.12)",
        borderTop: "1px solid rgba(0,255,65,0.2)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}>
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onNav(id)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all active:scale-90 relative"
            style={{ minWidth: "52px" }}>
            <div className="relative">
              <Icon className="w-5 h-5 transition-all"
                style={{ color: isActive ? "#00ff41" : "#64748b" }} />
              {id === "tasks" && badge > 0 && <NotifDot count={badge} />}
            </div>
            <span className="text-[10px] font-medium transition-all"
              style={{ color: isActive ? "#00ff41" : "#64748b" }}>
              {label}
            </span>
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ background: "#00ff41" }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ── View titles ────────────────────────────────────────────────────────────────
const VIEW_TITLES: Record<ViewId, string> = {
  home: "DeVAura",
  calendar: "Calendário",
  tasks: "Tarefas",
  quiz: "Quiz",
  files: "Arquivos",
};

// ── Login View ─────────────────────────────────────────────────────────────────
function LoginView({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar credenciais
    if (email === "62611204@ulife.com.br" && password === "Batatafrita123") {
      onLogin();
    } else {
      setError("Email ou senha incorretos");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
      {/* Logo */}
      <div className="mb-8">
        <img src={devauraLogo} alt="DeVAura" className="w-24 h-24 object-contain mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-center mb-2" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
          DeV<span style={{ color: "#00ff41" }}>Aura</span>
        </h1>
        <p className="text-sm text-center text-muted-foreground">Sua plataforma de estudos</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        {error && (
          <div className="rounded-2xl px-4 py-3 text-center"
            style={{ background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.3)" }}>
            <p className="text-sm font-medium" style={{ color: "#f43f5e" }}>{error}</p>
          </div>
        )}

        <div>
          <label className="block text-xs text-muted-foreground mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            required
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 mt-6"
          style={{ background: "#00ff41", color: "#000000" }}>
          Entrar
        </button>

        <div className="flex items-center justify-between mt-4">
          <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Esqueceu a senha?
          </button>
          <button type="button" className="text-xs font-semibold" style={{ color: "#00ff41" }}>
            Criar conta
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-auto pt-8">
        <p className="text-[10px] text-center text-muted-foreground" style={{ fontFamily: "DM Mono, monospace" }}>
          DeVAura v1.0.0
        </p>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<ViewId>("home");
  const [tasks, setTasks] = useState<Task[]>(INIT_TASKS);
  const [showAdd, setShowAdd] = useState(false);

  const pending = tasks.filter((t) => !t.completed).length;
  const urgent = tasks.filter((t) => !t.completed && daysUntil(t.dueDate) <= 3).length;

  return (
    <div className="flex items-center justify-center w-full h-full relative overflow-hidden" style={{
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,65,0.07) 0%, transparent 60%), linear-gradient(135deg, #060a0f 0%, #0a1020 40%, #071210 100%)",
    }}>
      {/* Desktop background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      {/* Glow orbs */}
      <div className="absolute pointer-events-none" style={{
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,255,65,0.06) 0%, transparent 70%)",
        top: "-20%", left: "-10%",
      }} />
      <div className="absolute pointer-events-none" style={{
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(31,112,66,0.08) 0%, transparent 70%)",
        bottom: "-10%", right: "-5%",
      }} />

      {/* Desktop label */}
      <div className="absolute top-6 left-8 hidden sm:flex items-center gap-2.5 pointer-events-none">
        <img src={devauraLogo} alt="DeVAura" className="w-7 h-7 object-contain opacity-80" />
        <span className="text-sm font-semibold tracking-wide" style={{ fontFamily: "Fraunces, Georgia, serif", color: "rgba(0,255,65,0.5)" }}>DeVAura</span>
      </div>
      <div className="absolute bottom-6 left-8 hidden sm:block pointer-events-none">
        <span className="text-[10px] font-mono" style={{ color: "rgba(0,255,65,0.2)" }}>v1.0.0 · Plataforma de Estudos</span>
      </div>

      {/* Phone shell */}
      <div className="flex flex-col relative overflow-hidden"
        style={{
          background: "rgba(10,16,32,0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          width: "100%",
          maxWidth: 390,
          height: "100%",
          maxHeight: 844,
          borderRadius: "clamp(0px, 4vw, 44px)",
          boxShadow: "0 0 0 1px rgba(0,255,65,0.18), 0 0 60px rgba(0,255,65,0.06), 0 32px 80px rgba(0,0,0,0.5)",
          border: "1px solid rgba(0,255,65,0.15)",
        }}>
        {!isLoggedIn ? (
          <LoginView onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <>
            {/* Status bar mock */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-2.5"
              style={{ background: "transparent", paddingTop: "max(12px, env(safe-area-inset-top))" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={devauraLogo} alt="DeVAura" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-sm" style={{ fontFamily: "Fraunces, Georgia, serif", color: "#e2e8f0" }}>
                  {view === "home" ? "DeVAura" : VIEW_TITLES[view]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {urgent > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full"
                    style={{ background: "rgba(244,63,94,0.15)" }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#f43f5e" }} />
                    <span className="text-[10px] font-bold" style={{ color: "#f43f5e" }}>{urgent} urgente{urgent > 1 ? "s" : ""}</span>
                  </div>
                )}
                <button onClick={() => setView("tasks")} className="w-8 h-8 rounded-full flex items-center justify-center relative"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  <Bell className="w-4 h-4" style={{ color: "#e2e8f0" }} />
                  {pending > 0 && <NotifDot count={pending} />}
                </button>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {view === "home" && <HomeView tasks={tasks} onGoTasks={() => setView("tasks")} onLogout={() => setIsLoggedIn(false)} />}
              {view === "calendar" && <CalendarView />}
              {view === "tasks" && <TasksView tasks={tasks} setTasks={setTasks} onAdd={() => setShowAdd(true)} />}
              {view === "quiz" && <QuizView />}
              {view === "files" && <FilesView />}
            </div>

            {/* Bottom nav */}
            <BottomNav active={view} onNav={setView} badge={pending} />

            {/* Add task sheet */}
            {showAdd && (
              <AddTaskSheet
                onAdd={(t) => setTasks([...tasks, t])}
                onClose={() => setShowAdd(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );

}
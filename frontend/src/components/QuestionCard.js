import React from "react";

const letters = ["A", "B", "C", "D", "E", "F"];

const QuestionCard = ({ question, index, total, selectedIndex, onSelect }) => (
  <div className="question-card">
    <div className="question-meta">
      <span className="eyebrow">
        Question {index + 1} / {total}
      </span>
      {question.difficulty && <span className={`pill pill-${question.difficulty}`}>{question.difficulty}</span>}
    </div>
    <h2 className="question-text">{question.text}</h2>
    <div className="options-grid">
      {question.options.map((opt, i) => (
        <button
          key={i}
          type="button"
          className={`option-btn ${selectedIndex === i ? "selected" : ""}`}
          onClick={() => onSelect(i)}
        >
          <span className="option-letter">{letters[i]}</span>
          <span>{opt}</span>
        </button>
      ))}
    </div>
  </div>
);

export default QuestionCard;

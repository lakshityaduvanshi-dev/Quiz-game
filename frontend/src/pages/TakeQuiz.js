import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import Loader from "../components/Loader";

const TakeQuiz = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(Date.now());

  useEffect(() => {
    if (!state?.category) {
      navigate("/dashboard");
      return;
    }
    const load = async () => {
      try {
        const res = await api.get("/quiz/start", {
          params: { category: state.category, count: state.count, difficulty: state.difficulty },
        });
        if (!res.data.questions.length) {
          setError("This category has no questions yet. Add some first.");
        } else {
          setCategoryInfo(res.data.category);
          setQuestions(res.data.questions);
        }
      } catch (err) {
        setError("Could not start the quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const commitAnswer = (selectedIndex) => {
    const nextAnswers = [...answers, { questionId: current._id, selectedIndex }];
    setAnswers(nextAnswers);
    return nextAnswers;
  };

  const goNext = (selectedIndex) => {
    const nextAnswers = commitAnswer(selectedIndex);
    setSelected(null);
    if (isLast) {
      finishQuiz(nextAnswers);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleExpire = () => {
    goNext(-1);
  };

  const handleSelect = (i) => {
    setSelected(i);
  };

  const handleNextClick = () => {
    if (selected === null) return;
    goNext(selected);
  };

  const finishQuiz = async (finalAnswers) => {
    setSubmitting(true);
    const timeTakenSeconds = Math.round((Date.now() - startedAt) / 1000);
    try {
      const res = await api.post("/quiz/submit", {
        category: state.category,
        timeTakenSeconds,
        answers: finalAnswers,
      });
      navigate("/quiz/result", { state: { result: res.data, categoryInfo } });
    } catch (err) {
      setError("Could not submit your quiz. Your answers were not saved.");
      setSubmitting(false);
    }
  };

  const progressPct = useMemo(() => (questions.length ? (index / questions.length) * 100 : 0), [index, questions.length]);

  if (loading) return <Loader label="Preparing your quiz" />;
  if (error)
    return (
      <div className="page container">
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
          Back to dashboard
        </button>
      </div>
    );
  if (submitting) return <Loader label="Grading your answers" />;

  return (
    <div className="page container quiz-page">
      <div className="quiz-head">
        <div>
          <span className="eyebrow">{categoryInfo?.name}</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <Timer seconds={state.seconds || 20} resetKey={index} onExpire={handleExpire} />
      </div>

      {current && (
        <QuestionCard
          question={current}
          index={index}
          total={questions.length}
          selectedIndex={selected}
          onSelect={handleSelect}
        />
      )}

      <div className="quiz-actions">
        <button className="btn btn-primary" disabled={selected === null} onClick={handleNextClick}>
          {isLast ? "Finish quiz" : "Next question"}
        </button>
      </div>
    </div>
  );
};

export default TakeQuiz;

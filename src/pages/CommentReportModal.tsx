interface ReportModalProps {
  onClose: () => void;
  onSubmit: () => void;
  reportReason: string;
  setReportReason: React.Dispatch<React.SetStateAction<string>>;
}

const CommentReportModal = ({
  onClose,
  onSubmit,
  reportReason,
  setReportReason,
}: ReportModalProps) => {
  return (
    <div className="fixed inset-0 bg-gray-20 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h3 className="text-xl font-semibold mb-4">신고 사유 입력</h3>
        <textarea
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder="신고 사유를 입력하세요..."
          className="w-full p-3 border rounded-lg mt-2"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={onSubmit}
            className="w-1/2 p-3 bg-red-600 text-white rounded-lg mr-2"
          >
            신고 제출
          </button>
          <button
            onClick={onClose}
            className="w-1/2 p-3 bg-gray-600 text-white rounded-lg"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentReportModal;
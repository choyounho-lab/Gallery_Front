import React from 'react';

interface DeleteConfirmationModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h3 className="text-lg font-semibold mb-4">댓글을 삭제하시겠습니까?</h3>
      <div className="flex justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded mr-2"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-white bg-red-600 rounded"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmationModal;
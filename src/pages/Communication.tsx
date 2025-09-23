// src/pages/Communication.tsx
import React, { useState } from 'react';

interface CommunicationProps {
  setMessage: (msg: string) => void;
}

export default function Communication({ setMessage }: CommunicationProps) {
  // 'announcements', 'inquiries', 'reports' 중 하나를 상태로 관리
  const [activeTab, setActiveTab] = useState<'announcements' | 'inquiries' | 'reports'>('announcements');

  // 각 탭의 내용을 렌더링하는 함수
  const renderContent = () => {
    switch (activeTab) {
      case 'announcements':
        return (
          <div className="text-center py-10">
            <h4 className="text-lg font-semibold text-white/80 mb-4">공지 작성</h4>
            <p className="text-white/50">공지사항을 작성하고 관리하는 기능이 여기에 들어갑니다.</p>
          </div>
        );
      case 'inquiries':
        return (
          <div className="text-center py-10">
            <h4 className="text-lg font-semibold text-white/80 mb-4">문의 내역</h4>
            <p className="text-white/50">사용자들이 보낸 문의 내역을 확인하고 답변하는 기능이 여기에 들어갑니다.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-10">
            <h4 className="text-lg font-semibold text-white/80 mb-4">신고 처리</h4>
            <p className="text-white/50">사용자들이 신고한 내용을 처리하는 기능이 여기에 들어갑니다.</p>
          </div>
        );
    }
  };

  const tabStyle = (tabName: string) => 
    `px-4 py-2 font-medium transition-colors cursor-pointer ${
      activeTab === tabName ? 'text-white border-b-2 border-[#00eaff]' : 'text-white/50 hover:text-white/70'
    }`;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl h-full min-h-[400px]">
      <div className="flex border-b border-white/10 mb-6">
        <div className={tabStyle('announcements')} onClick={() => setActiveTab('announcements')}>공지 작성</div>
        <div className={tabStyle('inquiries')} onClick={() => setActiveTab('inquiries')}>문의 내역</div>
        <div className={tabStyle('reports')} onClick={() => setActiveTab('reports')}>신고 처리</div>
      </div>
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
}
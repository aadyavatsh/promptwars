import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const InboxPage: React.FC = () => {
  const { students, teams, showToast, triggerNetworkPulse, navigateTo } = useApp();
  const [tab, setTab] = useState<'invitations' | 'messages'>('invitations');

  const [invites, setInvites] = useState([
    {
      id: 'inv-1',
      sender: students[1], // Priya
      teamName: 'Apex Agents Lab',
      targetHackathon: 'CalHacks 11.0',
      roleOffered: 'Frontend / Design Lead',
      message: 'Hey Alex! We loved your degree planner hackathon build from TreeHacks. We are assembling an AI agent squad for CalHacks and would love for you to join!',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: 'inv-2',
      sender: students[2], // Sarah
      teamName: 'Sunday HackForge #24 Squad',
      targetHackathon: 'Sunday HackForge #24',
      roleOffered: 'Lead Engineer',
      message: 'Building a real-time multiplayer Figma token sync for Sunday HackForge. Jump in if free!',
      time: 'Yesterday',
      status: 'pending',
    },
  ]);

  const handleAccept = (inviteId: string) => {
    setInvites((prev) =>
      prev.map((inv) => (inv.id === inviteId ? { ...inv, status: 'accepted' } : inv))
    );
    showToast('Squad invitation accepted! You have joined the team 🚀', 'success');
    triggerNetworkPulse(2);
  };

  const handleDecline = (inviteId: string) => {
    setInvites((prev) =>
      prev.map((inv) => (inv.id === inviteId ? { ...inv, status: 'declined' } : inv))
    );
    showToast('Invitation declined.', 'info');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/60 mb-1">
          <Send className="w-3.5 h-3.5" />
          <span>Messages & Team Invites</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Inbox & Squad Invites
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Review squad invitations and direct messages from verified university peers
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-[#131B2E] p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 w-fit">
        <button
          onClick={() => setTab('invitations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            tab === 'invitations'
              ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Squad Invitations ({invites.filter((i) => i.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            tab === 'messages'
              ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Direct Messages</span>
        </button>
      </div>

      {/* Invitations List */}
      {tab === 'invitations' && (
        <div className="space-y-4">
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={invite.sender.avatarUrl}
                    alt={invite.sender.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {invite.sender.fullName} invited you to join <span className="text-blue-600 dark:text-blue-400">{invite.teamName}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Target: {invite.targetHackathon} • Offered Role: <strong className="text-slate-700 dark:text-slate-300">{invite.roleOffered}</strong>
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-slate-400 self-start sm:self-auto">
                  {invite.time}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                "{invite.message}"
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => navigateTo('teammate-profile', invite.sender.id)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>View {invite.sender.fullName}'s Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                {invite.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecline(invite.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(invite.id)}
                      className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept & Join Squad</span>
                    </button>
                  </div>
                ) : invite.status === 'accepted' ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Invitation Accepted</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Declined</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'messages' && (
        <div className="p-12 text-center bg-white/60 dark:bg-[#131B2E]/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Direct Messages Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Send connection requests to teammates in Find Teammates or Sunday HackForge to start collaborative conversations.
          </p>
          <button
            onClick={() => navigateTo('explore')}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            Explore Teammates
          </button>
        </div>
      )}
    </div>
  );
};

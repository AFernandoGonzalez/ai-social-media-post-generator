import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCampaigns } from "../services/api";
import { capitalizeFirstLetter } from "../utils/stringCapitalizer";
import Button from "../components/Button";
import { useAudio } from "../contexts/AudioContext";
import NoContentDashboard from "../components/NoContentDashboard";
import { useTheme } from '../contexts/ThemeContext';
import useCustomToast from '../utils/useCustomToast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const showToast = useCustomToast();
  const [campaigns, setCampaigns] = useState([]);
  const [topics, setTopics] = useState([]);
  const { audios, loading: audioLoading, loadAudios } = useAudio();
  const { isDarkMode } = useTheme();

  const totalCampaigns = campaigns?.length;
  const totalTopics = topics?.length;
  const totalAudios = audios?.length;

  useEffect(() => {
    loadCampaigns();
    loadAudios();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await getCampaigns();
      const sortedCampaigns = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setCampaigns(sortedCampaigns);
      const allTopics = sortedCampaigns.reduce(
        (acc, campaign) => acc.concat(campaign.topics),
        []
      );
      const sortedTopics = allTopics.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTopics(sortedTopics);
    } catch (error) {
      showToast('Failed to load campaigns, Please Reload.', 'error', '❗');

    }
  };

  const formattedDate = new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());

  return (
    <div className={`${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'} min-h-full`}>
      <div className="container mx-auto p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            Welcome to Your Campaign Dashboard!
          </h2>
          <p className="text-sm text-gray-600">
            Today is {formattedDate}
          </p>
        </div>
        {campaigns.length === 0 && (
          <p>
            You haven't created any campaigns yet. Let's get started by setting
            up your first campaign.
          </p>
        )}

        <div className={`flex flex-col sm:flex-row lg:flex-row gap-6 mt-6 mb-6 border rounded-xl p-4 ${isDarkMode ? 'border-dark-border' : 'border-light-border'}`}>

          <div className={`flex-1 p-4 rounded-lg flex flex-col justify-center items-center ${isDarkMode ? 'bg-dark-surface' : 'bg-light-surface'}`}>
            <h2 className="text-lg md:text-xl lg:text-xl font-semibold text-center">
              Total Campaigns
            </h2>
            <p className={`text-3xl md:text-4xl font-bold text-center ${totalCampaigns ? '' : 'text-light-muted'}`}>
              {totalCampaigns || '0'}
            </p>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <span className={`h-full border-l-2 border-dashed ${isDarkMode ? 'border-dark-divider' : 'border-light-divider'}`}></span>
          </div>

          <div className={`flex-1 p-4 rounded-lg flex flex-col justify-center items-center ${isDarkMode ? 'bg-dark-surface' : 'bg-light-surface'}`}>
            <h2 className="text-lg md:text-xl lg:text-xl font-semibold text-center">
              Total Topics
            </h2>
            <p className={`text-3xl md:text-4xl font-bold text-center ${totalTopics ? '' : 'text-light-muted'}`}>
              {totalTopics || '0'}
            </p>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <span className={`h-full border-l-2 border-dashed ${isDarkMode ? 'border-dark-divider' : 'border-light-divider'}`}></span>
          </div>

          <div className={`flex-1 p-4 rounded-lg flex flex-col justify-center items-center ${isDarkMode ? 'bg-dark-surface' : 'bg-light-surface'}`}>
            <h2 className="text-lg md:text-xl lg:text-xl font-semibold text-center">
              Total Audios
            </h2>
            <p className={`text-3xl md:text-4xl font-bold text-center ${totalAudios ? '' : 'text-light-muted'}`}>
              {totalAudios || '0'}
            </p>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <span className={`h-full border-l-2 border-dashed ${isDarkMode ? 'border-dark-divider' : 'border-light-divider'}`}></span>
          </div>

          <div className="flex flex-1 p-4 rounded-lg flex-col justify-center items-center">
            <Link
              to="campaigns"
              className={`w-full flex items-center justify-center p-2 text-center ${isDarkMode ? 'bg-light-surface text-light-textPrimary' : 'bg-dark-surface text-dark-textPrimary'} font-semibold text-lg rounded-md hover:bg-main-accent transition-colors duration-300`}
            >
              <i className="fas fa-plus mr-2 text-xl" />
              Create Campaign
            </Link>
          </div>
        </div>


        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
            <div className={`flex flex-col items-center justify-start rounded-lg p-3 md:p-6 shadow-sm md:h-full ${isDarkMode ? 'bg-dark-surface' : 'bg-light-surface'}`}>
              <div className="flex w-full justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Recent Campaigns
                </h3>
                <Link
                  to="/dashboard/campaigns"
                  className="text-main-accent hover:underline"
                >
                  View all
                  <i className="m-2 fa-solid fa-chevron-right"></i>
                </Link>
              </div>

              <div className="hidden lg:flex w-full mt-4">
                <div className="relative flex w-full items-center justify-center">
                  <span className={`w-full border-t-2 border-dashed ${isDarkMode ? 'border-dark-divider' : 'border-light-divider'}`}></span>
                </div>
              </div>

              {campaigns.length === 0 ? (
                <NoContentDashboard
                  height="md:h-full"
                  icon="fas fa-bullhorn"
                  title="You don't have any Campaigns"
                  message="List of Campaigns you create will appear here."
                  buttonText="Create a Campaign"
                  onClick={() => console.log("Create a Campaign")}
                />
              ) : (
                <div className="flex flex-col items-center mt-4 w-full">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div
                      key={campaign._id}
                      className={`flex flex-wrap items-center justify-between w-full p-4 rounded-lg shadow-lg mb-3 transition transform hover:-translate-y-[1%] hover:shadow-xl ${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'} overflow-hidden`}
                    >
                      <div className=" md:flex ">
                        <div className="flex items-center justify-center w-12 h-12 bg-main-accent rounded-full">
                          <i className="fas fa-bullhorn text-white text-2xl"></i>
                        </div>

                        <div className="flex flex-col mt-1 md:ml-4 flex-grow overflow-hidden">
                          <h3 className="text-lg font-semibold truncate">
                            {capitalizeFirstLetter(campaign.title)}
                          </h3>
                          <span className="text-xs md:text-sm">
                            Created: {new Date(campaign.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex flex-wrap items-center mr-1 mt-1 md:mr-4 overflow-hidden">
                          {campaign.topics.slice(0, 3).map((topic) => (
                            <i
                              key={topic._id}
                              className={`fas fa-file-alt ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-dark-border' : 'border-light-border'} flex items-center justify-center`}
                            ></i>
                          ))}

                          {campaign.topics.length > 3 && (
                            <div className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-dark-border bg-dark-muted text-dark-textTertiary' : 'border-light-border bg-light-muted text-light-textTertiary'} text-xs flex items-center justify-center`}>
                              +{campaign.topics.length - 3}
                            </div>
                          )}
                        </div>

                        <Link
                          to={`/dashboard/campaigns/${campaign._id}`}
                          className="text-main-accent font-semibold hover:underline ml-2"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </Link>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>



         
            <div className={`flex flex-col items-center justify-start rounded-lg p-3 md:p-6 shadow-sm md:h-full ${isDarkMode ? 'bg-dark-surface' : 'bg-light-surface'}`}>
              <div className="flex w-full justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Recent Topics
                </h3>
              </div>

              <div className="hidden lg:flex w-full mt-4">
                <div className="relative flex w-full items-center justify-center">
                  <span className={`w-full border-t-2 border-dashed ${isDarkMode ? 'border-dark-divider' : 'border-light-divider'}`}></span>
                </div>
              </div>

              {topics.length === 0 ? (
                <NoContentDashboard
                  height="md:h-full"
                  icon="fas fa-file-alt"
                  title="You don't have any Topics"
                  message="List of Topics you create will appear here."
                />
              ) : (
                <div className="flex flex-col items-center mt-4 w-full ">
                  {topics.slice(0, 3).map((topic) => (
                    <div
                      key={topic._id}
                      className={`flex items-center w-full p-4 rounded-lg shadow-lg mb-3 transition transform hover:-translate-y-[1%] hover:shadow-xl ${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'}`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-main-accent rounded-full">
                        <i className="fas fa-file-alt text-white text-2xl"></i>
                      </div>

                      <div className="flex flex-col ml-4 flex-grow">
                        <h3 className="text-lg font-semibold">
                          {capitalizeFirstLetter(topic.title)}
                        </h3>
                        <span className="text-xs md:text-sm">
                          Created: {new Date(topic.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <Link
                        to={`/dashboard/topics/${topic._id}`}
                        className="text-main-accent font-semibold hover:underline"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

       
            <div className={`flex flex-col items-center justify-start rounded-lg p-3 md:p-6 shadow-sm md:h-full ${isDarkMode ? 'bg-dark-surface' : 'bg-light-surface'}`}>
              <div className="flex w-full justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Recent Audios
                </h3>
                <Link
                  to="/dashboard/audio"
                  className="text-main-accent hover:underline"
                >
                  View all
                  <i className="m-2 fa-solid fa-chevron-right"></i>
                </Link>
              </div>

              <div className="hidden lg:flex w-full mt-4">
                <div className="relative flex w-full items-center justify-center">
                  <span className={`w-full border-t-2 border-dashed ${isDarkMode ? 'border-dark-divider' : 'border-light-divider'}`}></span>
                </div>
              </div>

              {audios.length === 0 ? (
                <NoContentDashboard
                  height="md:h-full"
                  icon="fas fa-microphone"
                  title="You don't have any Audios"
                  message="List of Audios you create will appear here."
                  buttonText="Create a Audio"
                  link='audio'
                />
              ) : (
                <div className="flex flex-col items-center mt-4 w-full ">
                  {audios.slice(0, 3).map((audio) => (
                    <div
                      key={audio._id}
                      className={`flex items-center w-full p-4 rounded-lg shadow-lg mb-3 transition transform hover:-translate-y-[1%] hover:shadow-xl ${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'}`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-main-accent rounded-full">
                        <i className="fas fa-microphone text-white text-2xl"></i>
                      </div>

                      <div className="flex flex-col ml-4 flex-grow">
                        <h3 className="text-lg font-semibold">
                          {capitalizeFirstLetter(audio.title)}
                        </h3>
                        <span className="text-xs md:text-sm">
                          Created: {new Date(audio.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

           

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

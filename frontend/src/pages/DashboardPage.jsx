import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCampaigns } from "../services/api";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../utils/stringCapitalizer";
import Button from "../components/Button";
import { useAudio } from "../contexts/AudioContext";
import NoContentDashboard from "../components/NoContentDashboard";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [topics, setTopics] = useState([]);
  const { audios, loading: audioLoading, loadAudios } = useAudio();

  const totalCampaigns = campaigns?.length
  const totalTopics = topics?.length
  const totalAudios = audios?.length

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
      toast.error("Failed to load campaigns, Please Reload");
    }
  };

  return (
    <div className="bg-white min-h-full">
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">
          Welcome to Your Campaign Dashboard!
        </h2>
        {campaigns.length === 0 && (
          <p>
            You haven't created any campaigns yet. Let's get started by setting
            up your first campaign.
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-6 mt-6 mb-6 border rounded-xl p-2">
          <div className="flex-1 p-2 rounded-lg flex flex-col justify-center items-center">
            <h2 className="text-xl font text-gray-600 mb-2 text-center">
              Total Campaigns
            </h2>

            <p className={`text-4xl md:text-4xl font-bold text-center ${totalCampaigns ? 'text-gray-900' : 'text-gray-400'}`}>
              {totalCampaigns || '0'}
            </p>

          </div>

          <div className="hidden lg:flex relative items-center justify-center">
            <span className="h-full border-l-2 border-dashed border-gray-200"></span>
          </div>

          <div className="flex-1 p-2 rounded-lg flex flex-col justify-center items-center">
            <h2 className="text-xl font text-gray-600 mb-2 text-center">
              Total Topics
            </h2>
            <p className={`text-4xl md:text-4xl font-bold text-center ${totalTopics ? 'text-gray-900' : 'text-gray-400'}`}>
              {totalTopics || '0'}
            </p>

          </div>

          <div className="hidden lg:flex relative items-center justify-center">
            <span className="h-full border-l-2 border-dashed border-gray-200"></span>
          </div>

          <div className="flex-1 p-2 rounded-lg flex flex-col justify-center items-center">
            <h2 className="text-xl font text-gray-600 mb-2 text-center">
              Total Audios
            </h2>
            <p className={`text-4xl md:text-4xl font-bold text-center ${totalAudios ? 'text-gray-900' : 'text-gray-400'}`}>
              {totalAudios || '0'}
            </p>

          </div>

          <div className="hidden lg:flex relative items-center justify-center">
            <span className="h-full border-l-2 border-dashed border-gray-200"></span>
          </div>

          <div className="flex p-2  flex-col justify-center items-center">
            <Link
              to="campaigns"
              className="flex items-center justify-center p-2 bg-black text-white font-semibold text-lg rounded-md hover:bg-gray-800 transition-colors duration-300"
            >
              <i className="fas fa-plus mr-2 text-white text-xl" />
              Create Campaign
            </Link>
          </div>

        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaigns */}

            <div className="flex flex-col items-center justify-start bg-gray-100 rounded-lg p-3 md:p-6 shadow-sm md:h-full">
              <div className="flex w-full justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Campaigns
                </h3>
                <Link
                  to="/dashboard/campaigns"
                  className="text-blue-500 hover:underline"
                >
                  View all
                  <i className="m-2 fa-solid fa-chevron-right"></i>
                </Link>
              </div>

              <div className="hidden lg:flex w-full mt-4">
                <div className="relative flex w-full items-center justify-center">
                  <span className="w-full border-t-2 border-dashed border-gray-200"></span>
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
                <div className="flex flex-col items-center mt-4 w-full ">
                  {campaigns.slice(0, 3).map((campaign, index) => (
                    <div
                      key={campaign._id}
                      className="flex items-center w-full p-4 bg-white rounded-lg shadow-lg mb-3 transition transform hover:-translate-y-[1%] hover:shadow-xl"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <i className="fas fa-bullhorn text-blue-500 text-2xl"></i>
                      </div>

                      <div className="flex flex-col ml-4 flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {capitalizeFirstLetter(campaign.title)}
                        </h3>
                        <span className="text-xs md:text-sm text-gray-500">
                          Created:{" "}
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex mr-1 md:mr-4">
                        {campaign.topics.slice(0, 3).map((topic) => (
                          <i
                            key={topic._id}
                            className="fas fa-file-alt text-gray-800 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center"
                          ></i>
                        ))}
                        {campaign.topics.length > 3 && (
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 text-gray-700 text-xs flex items-center justify-center">
                            +{campaign.topics.length - 3}
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/dashboard/campaigns/${campaign._id}`}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Topics */}

            <div className="flex flex-col items-center justify-start bg-gray-100 rounded-lg p-3 md:p-6 shadow-sm md:h-full">
              <div className="flex w-full justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Topics
                </h3>
              </div>

              <div className="hidden lg:flex w-full mt-4">
                <div className="relative flex w-full items-center justify-center">
                  <span className="w-full border-t-2 border-dashed border-gray-200"></span>
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
                  {topics.slice(0, 3).map((topic, index) => (
                    <div
                      key={topic._id}
                      className="flex items-center w-full p-4 bg-white rounded-lg shadow-lg mb-3 transition transform hover:-translate-y-[1%] hover:shadow-xl"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                        <i className="fas fa-file-alt text-green-500 text-2xl"></i>
                      </div>

                      <div className="flex flex-col ml-4 flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {capitalizeFirstLetter(topic.title)}
                        </h3>
                        <span className="text-xs md:text-sm text-gray-500">
                          Created:{" "}
                          {new Date(topic.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <Link
                        to={`/dashboard/topics/${topic._id}`}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audios */}

            <div className="flex flex-col items-center justify-start bg-gray-100 rounded-lg p-3 md:p-6 shadow-sm md:h-full">
              <div className="flex w-full justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Audios
                </h3>
                <Link
                  to="/dashboard/audio"
                  className="text-blue-500 hover:underline"
                >
                  View all
                  <i className="m-2 fa-solid fa-chevron-right"></i>
                </Link>
              </div>

              <div className="hidden lg:flex w-full mt-4">
                <div className="relative flex w-full items-center justify-center">
                  <span className="w-full border-t-2 border-dashed border-gray-200"></span>
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
                  {audios.slice(0, 3).map((audio, index) => (
                    <div
                      key={audio._id}
                      className="flex items-center w-full p-4 bg-white rounded-lg shadow-lg mb-3 transition transform hover:-translate-y-[1%] hover:shadow-xl"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                        <i className="fas fa-microphone text-red-500 text-2xl"></i>
                      </div>

                      <div className="flex flex-col ml-4 flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {capitalizeFirstLetter(audio.title)}
                        </h3>
                        <span className="text-xs md:text-sm text-gray-500">
                          Created:{" "}
                          {new Date(audio.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <Link
                        to={`/dashboard/audios/${audio._id}`}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Future Content */}

            <div className="flex flex-col items-center justify-start bg-gray-100 rounded-lg p-3 md:p-6 shadow-sm md:h-full">
              <div className="flex w-full justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Future Content
                </h3>
                {/* <Link
                  to="/dashboard/future"
                  className="text-blue-500 hover:underline"
                >
                  View all
                  <i className="m-2 fa-solid fa-chevron-right"></i>
                </Link> */}
              </div>

              <div className="hidden lg:flex w-full mt-4">
                <div className="relative flex w-full items-center justify-center">
                  <span className="w-full border-t-2 border-dashed border-gray-200"></span>
                </div>
              </div>

              {audios.length === 0 ? (
                <NoContentDashboard
                  height="md:h-full"
                  icon="fas fa-tasks"
                  title="You don't have any Future Content"
                  message="List of Future Content you create will appear here."
                  
                />
              ) : (
                <div className="flex flex-col items-center mt-4 w-full ">
                  {[1, 2, 3].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center w-full p-4 bg-white rounded-lg shadow-lg mb-3 transition transform hover:-translate-y-[1%] hover:shadow-xl"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                        <i className="fas fa-clock text-gray-500 text-2xl"></i>
                      </div>

                      <div className="flex flex-col ml-4 flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Future Content {item}
                        </h3>
                        <span className="text-xs md:text-sm text-gray-500">
                          Created: {new Date().toLocaleDateString()}
                        </span>
                      </div>

                      <Link
                        to={`/dashboard/future/${item}`}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </Link>
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

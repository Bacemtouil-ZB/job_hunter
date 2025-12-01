import React, { createContext, useContext, useEffect, useState } from "react";
import { useGlobalContext } from "./globalContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const JobsContext = createContext();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const JobsContextProvider = ({ children }) => {
  const { userProfile, getUserProfile } = useGlobalContext();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userJobs, setUserJobs] = useState([]);

  const [searchQuery, setSearchQuery] = useState({
    tags: "",
    location: "",
    title: "",
  });

  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    internship: false,
    contract: false,
    fullStack: false,
    backend: false,
    devOps: false,
    uiUx: false,
  });

  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(50000);

  const handleFilterChange = (filterId) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  };

  const handleSearchChange = (searchName, value) => {
    setSearchQuery((prev) => ({ ...prev, [searchName]: value }));
  };

  const getJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/jobs");
      setJobs(res.data);
    } catch (error) {
      console.log("Error getting jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData) => {
    try {
      const res = await axios.post("/api/v1/jobs", jobData);

      toast.success("Job created successfully");

      setJobs((prevJobs) => [res.data, ...prevJobs]);

      // update userJobs
      if (userProfile?._id) {
        setUserJobs((prevUserJobs) => [res.data, ...prevUserJobs]);
        await getUserJobs(userProfile._id);
      }

      await getJobs();
      // redirect to the job details page
      router.push(`/job/${res.data._id}`);
    } catch (error) {
      console.log("Error creating job", error);
    }
  };

  const getUserJobs = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/jobs/user/" + userId);

      setUserJobs(res.data);
    } catch (error) {
      console.log("Error getting user jobs", error);
    } finally {
      setLoading(false);
    }
  };

  // Unified search: if args provided use them, otherwise use searchQuery + filters
  const searchJobs = async (tagsArg, locationArg, titleArg) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      const usingArgs = tagsArg || locationArg || titleArg;

      if (usingArgs) {
        if (tagsArg) queryParams.append("tags", tagsArg);
        if (locationArg) queryParams.append("location", locationArg);
        if (titleArg) queryParams.append("title", titleArg);
      } else {
        const jobTypes = [];
        if (filters.fullTime) jobTypes.push("Full Time");
        if (filters.partTime) jobTypes.push("Part Time");
        if (filters.contract) jobTypes.push("Contract");
        if (filters.internship) jobTypes.push("Internship");

        const tagList = [];
        if (filters.fullStack)
          tagList.push("full-stack", "fullstack", "full stack");
        if (filters.backend) tagList.push("backend", "back-end");
        if (filters.devOps) tagList.push("devops", "dev-ops");
        if (filters.uiUx) tagList.push("ui-ux", "uiux", "ui/ux");

        if (searchQuery.title) queryParams.append("title", searchQuery.title);
        if (searchQuery.location)
          queryParams.append("location", searchQuery.location);
        if (searchQuery.tags) queryParams.append("tags", searchQuery.tags);

        if (jobTypes.length > 0)
          queryParams.append("jobTypes", JSON.stringify(jobTypes));
        if (tagList.length > 0)
          queryParams.append("tags", JSON.stringify(tagList));

        if (minSalary > 0) queryParams.append("minSalary", minSalary);
        if (maxSalary < 50000) queryParams.append("maxSalary", maxSalary);
      }

      const res = await axios.get(
        `/api/v1/jobs/search?${queryParams.toString()}`
      );
      setJobs(res.data);
    } catch (error) {
      console.log("Error searching jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const getJobById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/jobs/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error getting job by id", error);
    } finally {
      setLoading(false);
    }
  };

  const likeJob = async (jobId) => {
    try {
      await axios.put(`/api/v1/jobs/like/${jobId}`);
      toast.success("Job liked successfully");
      await getJobs();
    } catch (error) {
      console.log("Error liking job", error);
    }
  };

  const applyToJob = async (jobId) => {
    const job = jobs.find((j) => j._id === jobId);

    if (
      job &&
      userProfile &&
      job.applicants &&
      job.applicants.includes(userProfile._id)
    ) {
      toast.error("You have already applied to this job");
      return;
    }

    try {
      await axios.put(`/api/v1/jobs/apply/${jobId}`);
      toast.success("Applied to job successfully");
      await getJobs();
    } catch (error) {
      console.log("Error applying to job", error);
      if (error?.response?.data?.message)
        toast.error(error.response.data.message);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`/api/v1/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      setUserJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.log("Error deleting job", error);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (userProfile?._id) {
      getUserJobs(userProfile._id);
      if (userProfile?.auth0Id) getUserProfile(userProfile.auth0Id);
    }
  }, [userProfile?._id]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        setJobs,
        loading,
        setLoading,
        userJobs,
        setUserJobs,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        handleFilterChange,
        handleSearchChange,
        minSalary,
        setMinSalary,
        maxSalary,
        setMaxSalary,
        getJobs,
        createJob,
        getUserJobs,
        searchJobs,
        getJobById,
        likeJob,
        applyToJob,
        deleteJob,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobsContext = () => {
  return useContext(JobsContext);
};

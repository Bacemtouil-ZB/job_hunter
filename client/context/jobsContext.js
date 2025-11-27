import React, { createContext, useContext, useEffect, useState } from "react";
import { useGlobalContext } from "./globalContext";
import axios from "axios";
import { toast } from "react-hot-toast"; // ADD THIS
import { useRouter } from "next/navigation"; // ADD THIS

const JobsContext = createContext();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const JobsContextProvider = ({ children }) => {
    const router = useRouter(); // ADD THIS
    const { userProfile } = useGlobalContext();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userJobs, setUserJobs] = useState([]);

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
            console.log("Sending job data:", jobData); // DEBUG: See what's being sent
            
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
            console.log("Error response:", error.response?.data); // DEBUG: See backend error
            toast.error(error.response?.data?.message || "Error creating job");
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

    const searchJobs = async (tags, location, title) => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (tags) query.append("tags", tags);
            if (location) query.append("location", location);
            if (title) query.append("title", title);

            const res = await axios.get(`/api/v1/jobs/search?${query.toString()}`);
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
            const res = await axios.put(`/api/v1/jobs/like/${jobId}`);
            toast.success("Job liked successfully");
            getJobs();
        } catch (error) {
            console.log("Error liking job", error);
            toast.error(error.response?.data?.message || "Error liking job");
        }
    };

    const applyToJob = async (jobId) => {
        const job = jobs.find((job) => job._id === jobId);

        if (job && job.applicants.includes(userProfile?._id)) {
            toast.error("You have already applied to this job");
            return;
        }

        try {
            const res = await axios.put(`/api/v1/jobs/apply/${jobId}`);
            toast.success("Applied to job successfully");
            getJobs();
        } catch (error) {
            console.log("Error applying to job", error);
            toast.error(error.response?.data?.message || "Error applying to job");
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
            toast.error(error.response?.data?.message || "Error deleting job");
        }
    };

    useEffect(() => {
        getJobs();
    }, []);

    useEffect(() => {
        if (userProfile?._id) {
            getUserJobs(userProfile._id);
        }
    }, [userProfile?._id]);

    return (
        <JobsContext.Provider value={{
            jobs,
            loading,
            createJob,
            userJobs,
            searchJobs,
            getJobById,
            likeJob,
            applyToJob,
            deleteJob,
        }}>
            {children}
        </JobsContext.Provider>
    );
};

export const useJobsContext = () => {
    return useContext(JobsContext);
};
// client/lib/aggregation-queries.ts
import { connectToDatabase } from '../lib/mongo_db';

// KPI 1: Distribution des Types d'Emploi
export async function getJobTypeDistribution() {
  const db = await connectToDatabase();
  
  console.log('🔍 Checking jobType structure...');
  const sample = await db.collection('jobs').findOne({});
  console.log('Sample job jobType:', sample?.jobType);
  
  const pipeline = [
    {
      $match: {
        jobType: { $exists: true, $ne: null }
      }
    },
    { $unwind: "$jobType" },
    {
      $group: {
        _id: "$jobType",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        name: "$_id",
        value: "$count",
        _id: 0
      }
    }
  ];

  const results = await db.collection('jobs').aggregate(pipeline).toArray();
  console.log('📊 Job type distribution results:', results);
  return results;
}

// KPI 2: Top 10 des Compétences/Tags Demandés
export async function getTopSkills() {
  const db = await connectToDatabase();
  
  console.log('🔍 Checking skills structure...');
  const sample = await db.collection('jobs').findOne({});
  console.log('Sample job skills:', sample?.skills);
  
  const pipeline = [
    {
      $match: {
        skills: { $exists: true, $ne: null, $not: { $size: 0 } }
      }
    },
    { $unwind: "$skills" },
    {
      $group: {
        _id: "$skills",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $project: {
        skill: "$_id",
        count: "$count",
        _id: 0
      }
    }
  ];

  const results = await db.collection('jobs').aggregate(pipeline).toArray();
  console.log('🎯 Top skills results:', results);
  return results;
}

// KPI 3: Tendances de Publication des Offres (par mois)
export async function getPublicationTrends() {
  const db = await connectToDatabase();
  
  console.log('🔍 Checking createdAt structure...');
  const sample = await db.collection('jobs').findOne({});
  console.log('Sample job createdAt:', sample?.createdAt);
  
  const pipeline = [
    {
      $match: {
        createdAt: { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: {
         $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: "$_id",
        count: "$count",
        _id: 0
      }
    }
  ];

  const results = await db.collection('jobs').aggregate(pipeline).toArray();
  console.log('📈 Publication trends results:', results);
  return results;
}

// KPI 4: Salaire Moyen par Type d'Emploi
export async function getAverageSalaryByType() {
  const db = await connectToDatabase();
  
  console.log('🔍 Checking salary structure...');
  const sample = await db.collection('jobs').findOne({});
  console.log('Sample job salary:', sample?.salary, 'type:', typeof sample?.salary);
  
  const pipeline = [
    {
      $match: {
        salary: { $exists: true, $ne: null, $gt: 0 },
        jobType: { $exists: true, $ne: null }
      }
    },
    { $unwind: "$jobType" },
    {
      $group: {
        _id: "$jobType",
        averageSalary: { $avg: "$salary" },
        count: { $sum: 1 }
      }
    },
    { $sort: { averageSalary: -1 } },
    {
      $project: {
        jobType: "$_id",
        averageSalary: { $round: ["$averageSalary", 2] },
        count: "$count",
        _id: 0
      }
    }
  ];

  const results = await db.collection('jobs').aggregate(pipeline).toArray();
  console.log('💰 Average salary results:', results);
  return results;
}

// KPI 5: Taux de Candidature Moyen
export async function getApplicationRate() {
  const db = await connectToDatabase();
  
  console.log('🔍 Checking applicants structure...');
  const sample = await db.collection('jobs').findOne({});
  console.log('Sample job applicants:', sample?.applicants);
  
  const pipeline = [
    {
      $project: {
        applicantCount: { $size: { $ifNull: ["$applicants", []] } }
      }
    },
    {
      $group: {
        _id: null,
        averageApplications: { $avg: "$applicantCount" },
        totalJobs: { $sum: 1 },
        totalApplications: { $sum: "$applicantCount" }
      }
    },
    {
      $project: {
        averageApplications: { $round: ["$averageApplications", 2] },
        totalJobs: 1,
        totalApplications: 1,
        _id: 0
      }
    }
  ];

  const results = await db.collection('jobs').aggregate(pipeline).toArray();
  console.log('📊 Application rate results:', results);
  return results[0] || { averageApplications: 0, totalJobs: 0, totalApplications: 0 };
}

// KPI 6: Distribution Géographique des Offres (Top 10 villes)
export async function getGeographicDistribution() {
  const db = await connectToDatabase();
  
  console.log('🔍 Checking location structure...');
  const sample = await db.collection('jobs').findOne({});
  console.log('Sample job location:', sample?.location);
  
  const pipeline = [
    {
      $match: {
        location: { $exists: true, $nin: [null, ""] }
      }
    },
    {
      $group: {
        _id: "$location",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $project: {
        location: "$_id",
        count: "$count",
        _id: 0
      }
    }
  ];

  const results = await db.collection('jobs').aggregate(pipeline).toArray();
  console.log('🗺️  Geographic distribution results:', results);
  return results;
}
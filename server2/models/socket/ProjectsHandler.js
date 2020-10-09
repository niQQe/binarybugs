const EventMessage = require('./EventMessage');

class ProjectsHandler {
	constructor(collections, eventBus) {
		this.collections = collections;
		this.eventBus = eventBus;
	}
	async handle(message) {
		console.log('I HaNDLER');
		console.log(message);
		try {
			const SINGLE_PROJECTS = await this.collections[message.payload.collection].find({});
			const SINGLE_BUGS = await this.collections['Bug'].find({});

			let projects = [];

			for (let project of SINGLE_PROJECTS) {
				const bugs = SINGLE_BUGS.filter((bug) => bug.projectid == project._id);
				projects.push({
					name: project.name,
					id: String(project._id),
					created: project.created,
					createdBy: project.createdBy,
					total: bugs.length,
					bugs: [
						{
							category: 'critical',
							amount: this.findActiveBugsAmount(bugs, 'critical'),
							percentage: 0,
						},
						{
							category: 'severe',
							amount: this.findActiveBugsAmount(bugs, 'severe'),
							percentage: 0,
						},
						{
							category: 'easy',
							amount: this.findActiveBugsAmount(bugs, 'easy'),
							percentage: 0,
						},
						{
							category: 'nth',
							amount: this.findActiveBugsAmount(bugs, 'nth'),
							percentage: 0,
						},
						{
							category: 'resolved',
							amount: this.findResolvedBugsAmount(bugs),
							percentage: 0,
						},
					],
				});
			}

			const res = projects;
			this.eventBus.next({
				...new EventMessage(res, message),
			});
		} catch (err) {
			console.log(err);
		}
	}
	findActiveBugsAmount(bugs, category) {
		const bugAmount = bugs.filter((bug) => bug.category == category && !bug.resolved);
		if (!bugAmount) return 0;
		return bugAmount.length;
	}
	findResolvedBugsAmount(bugs) {
		const bugAmount = bugs.filter((bug) => bug.resolved);
		if (!bugAmount) return 0;
		return bugAmount.length;
	}
}

ProjectsHandler.TYPE = 'find-all-projects';

module.exports = ProjectsHandler;

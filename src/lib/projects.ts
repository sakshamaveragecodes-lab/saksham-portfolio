import data from './projects.json';
export type DemoMode = 'LIVE' | 'CLIENT_SIDE_INTERACTIVE' | 'GUIDED_DEMO' | 'RECORDED_WALKTHROUGH' | 'CASE_STUDY';
export type Project = Omit<(typeof data)[number], 'mode'> & {mode: DemoMode};
export const projects = data as Project[];
export const github = 'https://github.com/sakshamaveragecodes-lab';
export const modeLabels: Record<DemoMode,string> = {LIVE:'Live application', CLIENT_SIDE_INTERACTIVE:'Browser interactive', GUIDED_DEMO:'Guided demo', RECORDED_WALKTHROUGH:'Recorded walkthrough', CASE_STUDY:'Case study'};
export const sourceFile = (p: Project, file=p.docs) => `${p.source}/blob/${p.commit}/${file}`;

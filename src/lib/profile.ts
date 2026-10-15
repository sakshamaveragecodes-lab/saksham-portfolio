// Populate only from the owner's official documents. Never infer missing values.
export const profile: {
 fullName: string;
 email: string | null;
 resume: {url:string; filename:string; verifiedDate:string} | null;
} = {
 fullName:'Saksham Pradeep Jadhav',
 email:null,
 resume:null,
};

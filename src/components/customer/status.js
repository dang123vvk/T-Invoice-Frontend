export function status(id)
{
   if(id === '1')
   {
       return 'New'
   }
   if(id === '2')
   {
       return 'Active'
   }
   if(id === '3')
   {
       return 'Used'
   }
   else 
   {
       return 'None'
   }
}
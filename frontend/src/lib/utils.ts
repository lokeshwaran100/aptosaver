import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function checkAndCreateUser(address: string, setUser:any) {
  try {
    // First, try to get the user
    const response = await axios.get('/api/user', { params: { address } });
    
    if (response.status === 200) {
      console.log('User exists:', response.data);
      setUser(response.data);
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // User not found, create a new user
      try {
        const createResponse = await axios.post('/api/user', { address });
        if (createResponse.status === 201) {
          console.log('New user created:', createResponse.data);
          return createResponse.data.user;
        }
      } catch (createError) {
        console.error('Error creating new user:', createError);
      }
    } else {
      console.error('Error checking user:', error);
    }
  }
}

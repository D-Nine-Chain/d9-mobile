export class AppError extends Error {
   title: string;
   data: any;
   userMessage: string | undefined;
   constructor(title: string, message?: string, data?: any) {
      super(); // Pass the message to the base Error class
      this.title = title;
      this.data = data;
      this.userMessage = message;
      this.name = this.constructor.name; // Set the error name to the class name
   }
}
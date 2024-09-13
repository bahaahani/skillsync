@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  public showErrorMessage(message: string) {
    // Implementation
    console.error(message);
  }
}
using Serilog;
using System.Runtime.CompilerServices;
using System.IO;

public static class LoggerExtensions {
	
	public static void INFO(this ILogger logger, string message,
		[CallerMemberName] string memberName = "",
		[CallerFilePath] string filePath = "",
		[CallerLineNumber] int lineNumber = 0) {
		string fileNameOnly = Path.GetFileNameWithoutExtension(filePath);

		logger
			.ForContext("CallerMemberName", memberName)
			.ForContext("CallerFilePath", fileNameOnly)
			.ForContext("CallerLineNumber", lineNumber)
			.Information(message);
	}


	public static void DEBUG(this ILogger logger, string message,
	[CallerMemberName] string memberName = "",
	[CallerFilePath] string filePath = "",
	[CallerLineNumber] int lineNumber = 0) {
		string fileNameOnly = Path.GetFileNameWithoutExtension(filePath);

		logger
			.ForContext("CallerMemberName", memberName)
			.ForContext("CallerFilePath", fileNameOnly)
			.ForContext("CallerLineNumber", lineNumber)
			.Debug(message);
	}

	public static void ERROR(this ILogger logger, string message,
	[CallerMemberName] string memberName = "",
	[CallerFilePath] string filePath = "",
	[CallerLineNumber] int lineNumber = 0) {
		string fileNameOnly = Path.GetFileNameWithoutExtension(filePath);

		logger
			.ForContext("CallerMemberName", memberName)
			.ForContext("CallerFilePath", fileNameOnly)
			.ForContext("CallerLineNumber", lineNumber)
			.Error(message);
	}
}

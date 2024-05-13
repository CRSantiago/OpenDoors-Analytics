import subprocess

def is_docker_running():
    try:
        # Running a simple Docker command to check if Docker is active
        subprocess.run(["docker", "info"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return True
    except subprocess.CalledProcessError:
        return False
    except FileNotFoundError:
        print("Docker is not installed. Please install Docker and try again.")
        return False

def execute_command():
    # Command to run RabbitMQ in a Docker container
    command = "docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management"

    try:
        # Run the command and stream output directly
        with subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1, universal_newlines=True) as process:
            # Print each line as it is received
            while True:
                output = process.stdout.readline()
                if process.poll() is not None and output == '':
                    break
                if output:
                    print(output.strip())
            # Check for any remaining output after the process ends
            if process.poll() is not None:
                print("Process exited with code", process.returncode)

    except Exception as e:
        print("An exception occurred:")
        print(str(e))

if __name__ == "__main__":
    if is_docker_running():
        print("Docker is running. Proceeding to run RabbitMQ in a Docker container.")
        execute_command()
    else:
        print("Docker is not running. Please start Docker and try again.")
